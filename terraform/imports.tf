import {
  to = azurerm_network_security_rule.inbound["ssh"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkSecurityGroups/genznext-nsg/securityRules/SSH"
}

import {
  to = azurerm_network_security_rule.inbound["http"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkSecurityGroups/genznext-nsg/securityRules/HTTP"
}

import {
  to = azurerm_network_security_rule.inbound["https"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkSecurityGroups/genznext-nsg/securityRules/HTTPS"
}

import {
  to = azurerm_public_ip.vm["dev"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/publicIPAddresses/dev-public-ip"
}

import {
  to = azurerm_public_ip.vm["prod"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/publicIPAddresses/prod-public-ip"
}

import {
  to = azurerm_network_interface.vm["dev"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkInterfaces/dev-nic"
}

import {
  to = azurerm_network_interface.vm["prod"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Network/networkInterfaces/prod-nic"
}

import {
  to = azurerm_linux_virtual_machine.vm["dev"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Compute/virtualMachines/dev-vm"
}

import {
  to = azurerm_linux_virtual_machine.vm["prod"]
  id = "/subscriptions/62432ed0-5cb0-4c5f-b5cf-ba4a4d9f1f02/resourceGroups/genznext-rg/providers/Microsoft.Compute/virtualMachines/prod-vm"
}
