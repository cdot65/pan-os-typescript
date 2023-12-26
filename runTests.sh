#!/bin/bash

# Array of test commands
TEST_COMMANDS=(
    "ts-node tests/testGenerateApiKey.ts"
    "ts-node tests/testExecuteOperationalCommand.ts 'show system info'"
    "ts-node tests/testExecuteOperationalCommand.ts 'request license info'"
    "ts-node tests/testExecuteOperationalCommand.ts '<request><license><info/></license></request>'"
    "ts-node tests/testShowJobsAll.ts"
    "ts-node tests/testShowRoutingRoute.ts"
    "ts-node tests/testShowJobsId.ts 21"
    "ts-node tests/testRequestLicenseInfo.ts"
    "ts-node tests/testShowSessionAll.ts"
    "ts-node tests/testShowSessionId.ts 98805"
    "ts-node tests/testShowSessionInfo.ts"
    "ts-node tests/testShowSessionAllFilter.ts 10.0.0.194 192.168.255.1"
    "ts-node tests/testUrlInfo.ts cdot.io"
    "ts-node tests/testUrlInfo.ts paloaltonetworks.com"
    "ts-node tests/testCreateAddressObject.ts -n test1 -v 'cdot.io' -t fqdn -d 'this is a test' -g 'Automation'"
    "ts-node tests/testCreateAddressObject.ts -n test2 -v 1.1.1.1/32 -t ip-netmask -d 'this is a test' -g 'Automation'"
    "ts-node tests/testShowResourceMonitor.ts"
    "ts-node tests/testShowSystemInfo.ts"
)

# Variable to track the number of failed tests
FAILED=0

# Function to execute each test
run_test() {
    echo "Executing: $1"
    $1
    if [ $? -ne 0 ]; then
        echo "Test failed: $1"
        FAILED=$((FAILED + 1))
    fi
}

# Iterate over and run each test command
for cmd in "${TEST_COMMANDS[@]}"; do
    run_test "$cmd"
done

# Check for failed tests
if [ $FAILED -ne 0 ]; then
    echo "Tests completed with $FAILED failures."
    exit 1
else
    echo "All tests passed successfully."
    exit 0
fi
