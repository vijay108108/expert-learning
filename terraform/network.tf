resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.common_tags
}

resource "azurerm_virtual_network" "main" {
  name                = var.vnet_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  address_space       = var.vnet_address_space
  tags                = var.common_tags
}

resource "azurerm_subnet" "main" {
  name                 = var.subnet_name
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = var.subnet_address_prefixes
}

resource "azurerm_public_ip" "vm" {
  for_each = var.vms

  name                = each.value.public_ip_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                 = "Standard"
  tags                = var.common_tags

  lifecycle {
    ignore_changes = [
      ip_tags,
      tags,
      zones
    ]
  }
}

resource "azurerm_network_interface" "vm" {
  for_each = var.vms

  name                = each.value.nic_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tags                = var.common_tags

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.main.id
    private_ip_address_allocation = each.value.private_ip_address == null ? "Dynamic" : "Static"
    private_ip_address            = each.value.private_ip_address
    public_ip_address_id          = azurerm_public_ip.vm[each.key].id
  }

  lifecycle {
    ignore_changes = [
      ip_configuration[0].private_ip_address,
      tags
    ]
  }
}
