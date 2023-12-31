#!/bin/bash

# Default log level
LOG_LEVEL="info"

# Check if a log level argument is provided
if [[ "$#" -eq 1 ]]; then
    LOG_LEVEL="$1"
fi

# Validate log level
case "${LOG_LEVEL}" in
error | warn | info | verbose | debug | silly) ;;
*)
    echo "Invalid log level: ${LOG_LEVEL}"
    echo "Valid log levels are: error, warn, info, verbose, debug, silly"
    exit 1
    ;;
esac

# Array of test commands
TEST_COMMANDS=(
    "ts-node tests/testGenerateApiKey.ts --logLevel ${LOG_LEVEL}"
    # "ts-node tests/testExecuteOperationalCommand.ts 'show system info'"
    # "ts-node tests/testExecuteOperationalCommand.ts 'request license info'"
    # "ts-node tests/testExecuteOperationalCommand.ts '<request><license><info/></license></request>'"
    "ts-node tests/testShowJobsAll.ts --logLevel ${LOG_LEVEL}"
    "ts-node tests/testShowRoutingRoute.ts --logLevel ${LOG_LEVEL}"
    "ts-node tests/testShowJobsId.ts 21 --logLevel ${LOG_LEVEL}"
    "ts-node tests/testRequestLicenseInfo.ts --logLevel ${LOG_LEVEL}"
    "ts-node tests/testShowSessionAll.ts --logLevel ${LOG_LEVEL}"
    "ts-node tests/testShowSessionId.ts 98805 --logLevel ${LOG_LEVEL}"
    "ts-node tests/testShowSessionInfo.ts --logLevel ${LOG_LEVEL}"
    "ts-node tests/testShowSessionAllFilter.ts 10.0.0.194 192.168.255.1 --logLevel ${LOG_LEVEL}"
    "ts-node tests/testUrlInfo.ts cdot.io --logLevel ${LOG_LEVEL}"
    "ts-node tests/testUrlInfo.ts paloaltonetworks.com --logLevel ${LOG_LEVEL}"
    "ts-node tests/testAddressObjectCreate.ts -n test1 -v cdot.io -t fqdn -d 'this is a test' -g Automation --logLevel ${LOG_LEVEL}"
    "ts-node tests/testAddressObjectCreate.ts -n test2 -v 1.1.1.1/32 -t ip-netmask -d 'this is a test' -g Automation --logLevel ${LOG_LEVEL}"
    "ts-node tests/testAddressObjectGetList.ts --logLevel ${LOG_LEVEL}"
    "ts-node tests/testShowResourceMonitor.ts --logLevel ${LOG_LEVEL}"
    "ts-node tests/testShowSystemInfo.ts --logLevel ${LOG_LEVEL}"
)

# Variable to track the number of failed tests
FAILED=0

# Function to execute each test with direct exit code checking
run_test() {
    echo "Executing: $1"
    if ! $1; then
        echo "Test failed: $1"
        FAILED=$((FAILED + 1))
    fi
}

# Iterate over and run each test command
for cmd in "${TEST_COMMANDS[@]}"; do
    run_test "${cmd}"
done

# Check for failed tests with double-quoted variable
if [[ "${FAILED}" -ne 0 ]]; then
    echo "Tests completed with ${FAILED} failures."
    exit 1
else
    echo "All tests passed successfully."
    exit 0
fi
