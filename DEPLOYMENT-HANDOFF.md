# Expert Learning Deployment Handoff

This document captures the Terraform adoption and dev VM deployment work completed between 3 Jun and 5 Jun.

## 1. Terraform Adoption

```powershell
az login
az account set --subscription "Azure subscription 1"
```

Result:
- Azure subscription selected: `62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02`

```powershell
az group create --name genznext-tfstate-rg --location centralindia
az storage account create --name genznexttfstate62432 --resource-group genznext-tfstate-rg --location centralindia --sku Standard_LRS --kind StorageV2 --min-tls-version TLS1_2 --allow-blob-public-access false
az storage container create --name tfstate --account-name genznexttfstate62432 --auth-mode login
```

Result:
- Azure Storage backend created for Terraform state

```powershell
cd C:\Users\veerv\OneDrive\Desktop\expert-learning\terraform
terraform init -backend-config="resource_group_name=genznext-tfstate-rg" -backend-config="storage_account_name=genznexttfstate62432" -backend-config="container_name=tfstate" -backend-config="key=expert-learning-prod.tfstate"
```

Result:
- Terraform backend initialized successfully

### Imported live Azure resources

```powershell
terraform import azurerm_resource_group.main "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg"
terraform import azurerm_virtual_network.main "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/virtualNetworks/genznext-vnet"
terraform import azurerm_subnet.main "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/virtualNetworks/genznext-vnet/subnets/genznext-subnet"
terraform import azurerm_network_security_group.main "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkSecurityGroups/genznext-nsg"
terraform import 'azurerm_network_security_rule.inbound["ssh"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkSecurityGroups/genznext-nsg/securityRules/SSH"
terraform import 'azurerm_network_security_rule.inbound["http"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkSecurityGroups/genznext-nsg/securityRules/HTTP"
terraform import 'azurerm_network_security_rule.inbound["https"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkSecurityGroups/genznext-nsg/securityRules/HTTPS"
terraform import 'azurerm_public_ip.vm["dev"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/publicIPAddresses/dev-public-ip"
terraform import 'azurerm_public_ip.vm["prod"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/publicIPAddresses/prod-public-ip"
terraform import 'azurerm_network_interface.vm["dev"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkInterfaces/dev-nic"
terraform import 'azurerm_network_interface.vm["prod"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkInterfaces/prod-nic"
terraform import 'azurerm_linux_virtual_machine.vm["dev"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Compute/virtualMachines/dev-vm"
terraform import 'azurerm_linux_virtual_machine.vm["prod"]' "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Compute/virtualMachines/prod-vm"
```

Result:
- Terraform state now manages the live Azure resources
- `terraform plan` returned `No changes`

## 2. Dev VM Bring-Up

### VM status and access

```powershell
az vm show -d -g genznext-rg -n dev-vm --query "{powerState:powerState,publicIps:publicIps,privateIps:privateIps}" -o json
az vm start -g genznext-rg -n dev-vm
az vm user update -g genznext-rg -n dev-vm -u azureuser --ssh-key-value $env:USERPROFILE\.ssh\id_ed25519.pub
ssh -i $env:USERPROFILE\.ssh\id_ed25519 azureuser@52.140.117.106
```

Result:
- Dev VM running
- SSH key login fixed

### App dependency and build

```powershell
az vm run-command invoke -g genznext-rg -n dev-vm --command-id RunShellScript --scripts "mkdir -p /etc/expert-learning" "touch /etc/expert-learning/app.env.example"
az vm run-command invoke -g genznext-rg -n dev-vm --command-id RunShellScript --scripts "install -m 600 /dev/null /etc/expert-learning/app.env"
scp -i $env:USERPROFILE\.ssh\id_ed25519 "C:\Users\veerv\OneDrive\Desktop\expert-learning\app\syllabus\cloud-devops-ai-summer-2026\page.tsx" "C:\Users\veerv\OneDrive\Desktop\expert-learning\app\syllabus\cloud-devops-ai-summer-2026\PrintButton.tsx" azureuser@52.140.117.106:/home/azureuser/expert-learning/app/syllabus/cloud-devops-ai-summer-2026/
az vm run-command invoke -g genznext-rg -n dev-vm --command-id RunShellScript --scripts "cd /home/azureuser/expert-learning && npm ci"
az vm run-command invoke -g genznext-rg -n dev-vm --command-id RunShellScript --scripts "cd /home/azureuser/expert-learning && npm run build"
```

Result:
- `npm ci` succeeded
- `npm run build` succeeded after fixing the syllabus page Client Component issue

### PM2 and env file fixes

```bash
python3 -c "from pathlib import Path; p=Path('/etc/expert-learning/app.env'); s=p.read_text(); s=s.replace('RESEND_FROM_EMAIL=GenZNext\n<onboarding.dev>\n', 'RESEND_FROM_EMAIL=\"GenZNext <onboarding@resend.dev>\"\n'); p.write_text(s)"
cd /home/azureuser/expert-learning && set -a && source /etc/expert-learning/app.env && set +a && pm2 start npm --name expert-learning -- start -- -p 3000
pm2 status
pm2 save
```

Result:
- App started successfully under PM2
- PM2 process list saved

## 3. Nginx Reverse Proxy

```powershell
scp -i $env:USERPROFILE\.ssh\id_ed25519 "C:\Users\veerv\OneDrive\Desktop\expert-learning\terraform\nginx-expert-learning.conf" azureuser@52.140.117.106:/home/azureuser/nginx-expert-learning.conf
az vm run-command invoke -g genznext-rg -n dev-vm --command-id RunShellScript --scripts "cp /home/azureuser/nginx-expert-learning.conf /etc/nginx/sites-available/expert-learning" "rm -f /etc/nginx/sites-enabled/default" "ln -sf /etc/nginx/sites-available/expert-learning /etc/nginx/sites-enabled/expert-learning" "nginx -t" "systemctl reload nginx"
```

Result:
- Nginx config test passed
- Nginx reloaded successfully
- Public dev IP now serves the application

## 4. Notable Failures and Fixes

```text
- terraform import of NSG rule with bad quoting failed with: "Index value required"
- SSH initially asked for a password until the Azure SSH key was updated
- sudo deploy command failed because the sudo password was unknown
- app startup failed when /etc/expert-learning/app.env had a malformed RESEND_FROM_EMAIL line
- Next.js build failed before the syllabus page fix because event handlers were passed to a Client Component
- Nginx rewrite attempts failed several times because PowerShell and bash quoting collided
```

## 5. Final Outcome

```text
- Terraform is attached to the live Azure infrastructure
- Dev VM is running the Next.js app
- PM2 is managing the app process
- Nginx is proxying traffic to localhost:3000
- http://52.140.117.106 serves the real application
```
