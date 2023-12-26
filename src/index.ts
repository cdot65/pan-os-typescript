// src/index.ts

/**
 * Provides low-level HTTP client functionality for handling API requests and responses.
 *
 * @module BaseClient
 */
export { BaseClient } from './BaseClient';

/**
 * The `Device` class extends `BaseService` to offer device-specific API operations.
 * It acts as a base for more specialized service classes like `FirewallService`.
 *
 * @module Device
 */
export { Device } from './Device';

/**
 * The `FirewallService` class, building upon the `Device` class, provides methods
 * specifically tailored to interacting with PAN-OS firewalls. This includes:
 * - Resource monitoring
 * - System information retrieval
 *
 * @module services/FirewallService
 */
export { FirewallService } from './services/FirewallService';

/**
 * The `PanObject` class serves as the base class for various PAN-OS object types,
 * providing common functionality like XML conversion and hierarchical relationships.
 *
 * @module objects/PanObject
 */
export { PanObject } from './objects/PanObject';

/**
 * The `AddressType` type defines the supported address formats in PAN-OS,
 * such as IP netmask, IP range, and fully qualified domain names (FQDN).
 *
 * @module objects/AddressObject
 */
export { AddressType } from './objects/AddressObject';

/**
 * The `AddressObject` class abstracts the address object concept in PAN-OS
 * and provides methods to manipulate these objects. Usage examples include:
 * - Creating, updating, or deleting address objects
 * - Associating address objects with policies or other entities
 *
 * @module objects/AddressObject
 */
export { AddressObject } from './objects/AddressObject';
