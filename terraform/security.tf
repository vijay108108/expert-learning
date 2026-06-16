locals {
  inbound_security_rules = {
    ssh = {
      name        = "SSH"
      priority    = 100
      destination = "22"
    }
    http = {
      name        = "HTTP"
      priority    = 110
      destination = "80"
    }
    https = {
      name        = "HTTPS"
      priority    = 120
      destination = "443"
    }
  }
}

resource "azurerm_network_security_group" "main" {
  name                = var.network_security_group_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  tags                = var.common_tags
}

resource "azurerm_network_security_rule" "inbound" {
  for_each = local.inbound_security_rules

  name                        = each.value.name
  priority                    = each.value.priority
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "Tcp"
  source_port_range           = "*"
  destination_port_range      = each.value.destination
  source_address_prefix       = "*"
  destination_address_prefix  = "*"
  resource_group_name         = azurerm_resource_group.main.name
  network_security_group_name = azurerm_network_security_group.main.name
}

resource "azurerm_subnet_network_security_group_association" "main" {
  subnet_id                 = azurerm_subnet.main.id
  network_security_group_id = azurerm_network_security_group.main.id
}
