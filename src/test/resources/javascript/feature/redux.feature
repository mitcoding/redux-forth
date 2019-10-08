Feature: Fouth Emulator

Scenario: Multiply n1 by n2 leaving the product n3
	Given User has Entered 2
	And User has Entered 3
	When User enters *
	Then Only 6 should exist
