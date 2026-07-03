resource "azurerm_linux_virtual_machine" "vm" {
  for_each = var.vms

  name                            = each.value.vm_name
  location                        = azurerm_resource_group.main.location
  resource_group_name             = azurerm_resource_group.main.name
  size                            = var.vm_size
  admin_username                  = var.admin_username
  disable_password_authentication = false
  network_interface_ids           = [azurerm_network_interface.vm[each.key].id]
  tags                            = var.common_tags

  dynamic "admin_ssh_key" {
    for_each = var.admin_ssh_public_key == null ? [] : [var.admin_ssh_public_key]

    content {
      username   = var.admin_username
      public_key = admin_ssh_key.value
    }
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  custom_data = base64encode(templatefile("${path.module}/cloud-init.yaml", {
    admin_username   = var.admin_username
    repository_url   = var.repository_url
    app_branch       = each.value.deployment_branch
    application_port = var.application_port
    domain_names     = var.domain_names
  }))

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      admin_ssh_key,
      custom_data,
      os_disk,
      source_image_reference,
      tags
    ]
  }
}
