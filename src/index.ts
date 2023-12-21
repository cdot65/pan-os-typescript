// src/index.ts

/**
 * BaseClient provides low-level HTTP client functionalities,
 * including handling of API requests and responses.
 */
export { BaseClient } from './BaseClient';

/**
 * BaseService is an abstract class providing common functionalities
 * for service classes, leveraging the BaseClient for API interactions.
 */
export { BaseService } from './services/BaseService';

/**
 * DeviceService extends BaseService to offer device-specific API operations,
 * serving as a base for more specialized service classes like FirewallService.
 */
export { DeviceService } from './services/DeviceService';

/**
 * FirewallService, building on DeviceService, provides methods tailored to
 * interacting with PAN-OS firewalls, facilitating operations like
 * resource monitoring and system info retrieval.
 */
export { FirewallService } from './services/FirewallService';

/**
 * NetworkService focuses on network-related functionalities within PAN-OS,
 * offering a suite of methods to manage and configure network aspects of the devices.
 */
export { NetworkService } from './services/NetworkService';

/**
 * PanoramaService extends DeviceService to handle Panorama-specific tasks,
 * allowing users to manage and control Panorama instances through the SDK.
 */
export { PanoramaService } from './services/PanoramaService';