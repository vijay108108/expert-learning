# Expert Learning Azure Infrastructure

This directory is designed to adopt and manage the existing Azure infrastructure for Expert Learning without destroying or recreating resources.

Existing environment:

- Subscription: Azure subscription 1
- Region: Central India
- Resource group: `genznext-rg`
- VNet: `genznext-vnet` (`10.0.0.0/16`)
- Subnet: `genznext-subnet` (`10.0.1.0/24`)
- NSG: `genznext-nsg`
- Dev VM: `dev-vm` (`52.140.117.106`)
- Prod VM: `prod-vm` (`20.193.240.195`)

## Safety Rules

- Do not run `terraform apply` before all existing resources have been imported.
- Do not run `terraform destroy` against production infrastructure unless a separate decommission plan has been approved.
- The VM resources use `prevent_destroy = true`.
- Never commit `.env`, `*.tfvars`, private keys, or real secret values.
- Use `terraform plan` after every import and resolve unexpected replacement actions before apply.

## Branch Strategy

- `main`: production application and infrastructure release branch.
- `dev`: integration branch for application changes deployed to the dev VM.
- `infra/terraform`: Terraform changes, imports, backend changes, and infrastructure documentation.
- `infra/cicd`: Azure DevOps or GitHub Actions pipeline changes.
- `feature/*`: short-lived application feature branches.
- `hotfix/*`: urgent production fixes branched from `main`, merged back to `main` and `dev`.

Recommended workflow:

```bash
git switch dev
git pull origin dev
git switch -c infra/terraform
```

## Remote State Backend

Create the Terraform state storage once. Use a globally unique storage account name.

```bash
az login
az account set --subscription "<subscription_id>"

az group create \
  --name genznext-tfstate-rg \
  --location centralindia

az storage account create \
  --name "<globally_unique_storage_account_name>" \
  --resource-group genznext-tfstate-rg \
  --location centralindia \
  --sku Standard_LRS \
  --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false

az storage container create \
  --name tfstate \
  --account-name "<globally_unique_storage_account_name>" \
  --auth-mode login
```

Initialize Terraform with backend configuration:

```bash
cd terraform

terraform init \
  -backend-config="resource_group_name=genznext-tfstate-rg" \
  -backend-config="storage_account_name=<globally_unique_storage_account_name>" \
  -backend-config="container_name=tfstate" \
  -backend-config="key=expert-learning-prod.tfstate"
```

## Configure Variables

Copy the example and replace placeholders. Do not commit the resulting file.

```bash
cp terraform.tfvars.example terraform.tfvars
```

Discover the current VM size, NIC names, and Public IP resource names:

```bash
az vm show -g genznext-rg -n dev-vm --query "{vmSize:hardwareProfile.vmSize,nics:networkProfile.networkInterfaces[].id}" -o json
az vm show -g genznext-rg -n prod-vm --query "{vmSize:hardwareProfile.vmSize,nics:networkProfile.networkInterfaces[].id}" -o json

az network public-ip list -g genznext-rg --query "[?ipAddress=='52.140.117.106' || ipAddress=='20.193.240.195'].{name:name,ip:ipAddress,id:id}" -o table
```

## Import Existing Resources

Set these shell variables first:

```bash
SUBSCRIPTION_ID="<subscription_id>"
RG="genznext-rg"
VNET="genznext-vnet"
SUBNET="genznext-subnet"
NSG="genznext-nsg"
DEV_NIC="<existing_dev_nic_name>"
PROD_NIC="<existing_prod_nic_name>"
DEV_PIP="<existing_dev_public_ip_resource_name>"
PROD_PIP="<existing_prod_public_ip_resource_name>"
```

Import the shared network resources:

```bash
terraform import azurerm_resource_group.main "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG"

terraform import azurerm_virtual_network.main "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/virtualNetworks/$VNET"

terraform import azurerm_subnet.main "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/virtualNetworks/$VNET/subnets/$SUBNET"

terraform import azurerm_network_security_group.main "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/networkSecurityGroups/$NSG"

terraform import azurerm_subnet_network_security_group_association.main "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/virtualNetworks/$VNET/subnets/$SUBNET"
```

Import NSG rules. If the existing rule names are different, either rename them in `security.tf` before import or import using the existing names and then plan carefully.

```bash
terraform import 'azurerm_network_security_rule.inbound["ssh"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/networkSecurityGroups/$NSG/securityRules/Allow-SSH"

terraform import 'azurerm_network_security_rule.inbound["http"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/networkSecurityGroups/$NSG/securityRules/Allow-HTTP"

terraform import 'azurerm_network_security_rule.inbound["https"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/networkSecurityGroups/$NSG/securityRules/Allow-HTTPS"
```

Import Public IPs, NICs, and VMs:

```bash
terraform import 'azurerm_public_ip.vm["dev"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/publicIPAddresses/$DEV_PIP"

terraform import 'azurerm_public_ip.vm["prod"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/publicIPAddresses/$PROD_PIP"

terraform import 'azurerm_network_interface.vm["dev"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/networkInterfaces/$DEV_NIC"

terraform import 'azurerm_network_interface.vm["prod"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Network/networkInterfaces/$PROD_NIC"

terraform import 'azurerm_linux_virtual_machine.vm["dev"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Compute/virtualMachines/dev-vm"

terraform import 'azurerm_linux_virtual_machine.vm["prod"]' "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RG/providers/Microsoft.Compute/virtualMachines/prod-vm"
```

After every few imports, run:

```bash
terraform plan
```

If Terraform proposes replacing a VM, Public IP, NIC, VNet, or subnet, stop and align the variables/resource arguments with the imported Azure resource before applying.

## Plan And Apply

Format and validate:

```bash
terraform fmt -recursive
terraform validate
```

Review the adoption plan:

```bash
terraform plan -out=tfplan
```

Apply only after the plan shows expected in-place changes:

```bash
terraform apply tfplan
```

## Cloud-Init And Application Deployment

`cloud-init.yaml` is intended for newly created or rebuilt VMs. It installs:

- curl, wget, git, unzip, ca-certificates, gnupg, build-essential, ufw
- Node.js 22 and npm
- PM2
- Nginx
- Certbot and python3-certbot-nginx
- Python 3 and pip

It also clones the repository, checks out `dev` for the dev VM and `main` for the prod VM, runs `npm ci`, builds the app, starts it with PM2, enables PM2 startup, and configures Nginx as a reverse proxy to port `3000`.

Secrets are not embedded in Terraform. On each VM, create:

```bash
sudo cp /etc/expert-learning/app.env.example /etc/expert-learning/app.env
sudo nano /etc/expert-learning/app.env
sudo chmod 640 /etc/expert-learning/app.env
sudo /usr/local/bin/deploy-expert-learning
```

For SSL after DNS points to the VM:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## Environment Variables

Required application variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_FIREBASE_PHONE_AUTH_TEST_MODE
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL
ADMISSIONS_EMAIL
GMAIL_USER
GMAIL_APP_PASSWORD
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_FROM
POSTHOG_KEY
POSTHOG_HOST
AIRTABLE_API_KEY
AIRTABLE_BASE_ID
AIRTABLE_TABLE_NAME
ADMIN_EMAILS
ADMIN_PHONES
NEXT_PUBLIC_ADMIN_PIN
ADMIN_SETUP_KEY
```

Next.js inlines `NEXT_PUBLIC_*` values during `npm run build`, so build dev and prod with environment-specific public values.

## Destroy

Production destroy is intentionally discouraged. The VM resources have `prevent_destroy = true`, so a full destroy will fail unless that guardrail is deliberately removed.

For a real decommission, first create a written backup and rollback plan, confirm state ownership, remove DNS traffic, snapshot disks, then remove `prevent_destroy` in a dedicated pull request.
