// src/index.ts

/**
 * Exports the foundational and specialized classes for interacting with PAN-OS devices and their configurations.
 * This includes base objects, device-specific classes, and various object types for network configuration.
 */

/**
 * `Firewall` specializes `PanDevice` for interacting with PAN-OS firewall devices. It includes methods for firewall-specific
 * functionalities like resource monitoring and system information retrieval.
 */
export { Firewall } from './objects/Firewall';

/**
 * `AddressObject` represents network address configurations in PAN-OS. It provides methods for managing address objects
 * and associating them with policies and system entities.
 *
 * `AddressType` defines the supported formats of network addresses in PAN-OS, including IP netmask, IP range, and FQDN.
 */
export { AddressObject, AddressType } from './objects/AddressObject';
