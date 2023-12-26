// src/index.ts

/**
 * The `ApiClient` class provides low-level HTTP client functionality essential for handling API requests and responses.
 * It is responsible for setting up HTTP communication details such as base URLs, headers, and response types.
 *
 * @module ApiClient
 */
export { ApiClient } from './ApiClient';

/**
 * The `PanDevice` class extends from `BaseService` to provide device-specific API operations and properties.
 * This class serves as the foundation for specialized service classes such as `Firewall`, by offering
 * a common structure and behavior for device entities.
 *
 * @examples Creating and managing device-specific settings and operations.
 * @module Device
 */
export { PanDevice } from './objects/PanDevice';

/**
 * The `Firewall` class extends the `PanDevice` class, delivering methods customized for interaction
 * with devices running PAN-OS firewall software. The provided methods focus on essential firewall
 * functionalities like resource monitoring and retrieving system information.
 *
 * @module services/Firewall
 */
export { Firewall } from './objects/Firewall';

/**
 * Serves as the base class for multiple PAN-OS object types, `PanObject` provides foundational
 * functionalities such as generating XML representations of objects and handling hierarchical
 * relationships between different PAN-OS entities.
 *
 * @module objects/PanObject
 */
export { PanObject } from './objects/PanObject';

/**
 * Defines supported formats of network addresses in PAN-OS. This enumeration includes various
 * types of network addresses such as IP netmask, IP range, and fully qualified domain names (FQDN).
 *
 * @typedef AddressType
 * @enum `AddressType` An enumeration of supported address formats in PAN-OS.
 * @module objects/AddressObject
 */
export { AddressType } from './objects/AddressObject';

/**
 * The `AddressObject` class encapsulates the concept of network address objects in PAN-OS,
 * offering a set of methods to create, update, or delete address objects, and to associate
 * them with different policies and entities in the system.
 *
 * @module objects/AddressObject
 */
export { AddressObject } from './objects/AddressObject';
