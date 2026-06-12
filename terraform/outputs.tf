output "resource_group_name" {
  description = "Managed Azure resource group."
  value       = azurerm_resource_group.main.name
}

output "virtual_network_name" {
  description = "Managed Azure virtual network."
  value       = azurerm_virtual_network.main.name
}

output "dev_vm_public_ip" {
  description = "Dev VM public IP address."
  value       = azurerm_public_ip.vm["dev"].ip_address
}

output "prod_vm_public_ip" {
  description = "Prod VM public IP address."
  value       = azurerm_public_ip.vm["prod"].ip_address
}

output "vm_public_ips" {
  description = "All managed VM public IP addresses."
  value       = { for key, pip in azurerm_public_ip.vm : key => pip.ip_address }
}
