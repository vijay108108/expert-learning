variable "subscription_id" {
  description = "Azure subscription ID. Keep null to use the subscription from Azure CLI or workload identity authentication."
  type        = string
  default     = null
  nullable    = true
}

variable "location" {
  description = "Azure region for the existing resources."
  type        = string
  default     = "centralindia"
}

variable "resource_group_name" {
  description = "Existing resource group name."
  type        = string
  default     = "genznext-rg"
}

variable "vnet_name" {
  description = "Existing virtual network name."
  type        = string
  default     = "genznext-vnet"
}

variable "vnet_address_space" {
  description = "Existing virtual network address space."
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "subnet_name" {
  description = "Existing subnet name."
  type        = string
  default     = "genznext-subnet"
}

variable "subnet_address_prefixes" {
  description = "Existing subnet address prefixes."
  type        = list(string)
  default     = ["10.0.1.0/24"]
}

variable "network_security_group_name" {
  description = "Existing network security group name."
  type        = string
  default     = "genznext-nsg"
}

variable "admin_username" {
  description = "Linux VM admin username."
  type        = string
  default     = "azureuser"
}

variable "admin_ssh_public_key" {
  description = "SSH public key for VM creation if a VM is ever created by Terraform. Do not store private keys in Terraform."
  type        = string
  default     = null
  nullable    = true
  sensitive   = true
}

variable "repository_url" {
  description = "Application repository cloned by cloud-init for new VMs."
  type        = string
  default     = "https://github.com/vijay108108/expert-learning.git"
}

variable "application_port" {
  description = "Local Next.js port used by PM2 and Nginx."
  type        = number
  default     = 3000
}

variable "vm_size" {
  description = "Azure VM size. Set this to the current VM size before import to prevent drift."
  type        = string
  default     = "Standard_D2s_v3"
}

variable "common_tags" {
  description = "Common tags applied to managed Azure resources."
  type        = map(string)
  default = {
    application = "expert-learning"
    managed-by  = "terraform"
  }
}

variable "vms" {
  description = "Existing VM, NIC, and Public IP names. Update NIC/Public IP names from Azure before importing."
  type = map(object({
    vm_name            = string
    nic_name           = string
    public_ip_name     = string
    public_ip_address  = string
    deployment_branch  = string
    private_ip_address = optional(string)
  }))
  default = {
    dev = {
      vm_name           = "dev-vm"
      nic_name          = "dev-nic"
      public_ip_name    = "dev-public-ip"
      public_ip_address = "52.140.117.106"
      deployment_branch = "dev"
    }
    prod = {
      vm_name           = "prod-vm"
      nic_name          = "prod-nic"
      public_ip_name    = "prod-public-ip"
      public_ip_address = "20.193.240.195"
      deployment_branch = "main"
    }
  }
}
