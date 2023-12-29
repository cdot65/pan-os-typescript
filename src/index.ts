// src/index.ts

/**
 * @module Provides foundational and specialized classes for interacting with
 * Palo Alto Networks Operating System (PAN-OS) devices including base objects,
 * device-specific classes, and various object types for network configuration.
 */

/**
 * Represents a specialized `PanDevice` for interacting with Palo Alto Networks firewall devices.
 * This class includes methods that provide firewall-specific functionalities,
 * such as resource monitoring and system information retrieval.
 *
 * @class Firewall
 * @extends PanDevice
 * @exports
 */
export { Firewall } from './models/Firewall';

/**
 * Represents network address configurations in Palo Alto Networks Operating System (PAN-OS).
 * This class provides methods for managing address objects and associating them with
 * security policies and other system entities.
 *
 * @class AddressObject
 * @exports
 */
export { AddressObject } from './models/AddressObject';

/**
 * Enumerates the supported formats of network addresses in PAN-OS, such as IP netmask,
 * IP range, and Fully Qualified Domain Name (FQDN).
 *
 * @enum AddressType
 * @exports
 */
export { AddressType } from './models/AddressObject';
