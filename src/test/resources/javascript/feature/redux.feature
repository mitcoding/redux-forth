Feature: Fouth Emulator

Scenario: Multiply integer 1 by integer 2 leaving the product integer 3
	Given User has entered 2
	And User has entered 3
	When User runs '*'
	Then 6 should be on top 
	And NumberStack should only have 1 number

Scenario: Multiply integer 1 by integer 2, creating result d. Then divide d by integer 3, leaving the integer 4. 
	Given User has entered 2 
	And User has entered 9
	And User has entered 10
	When User runs '*/'
	Then 1 should be on top
	And NumberStack should only have 1 number

Scenario: Multiply integer 1 by integer 2, creating result d. Then divide d by integer 3, and leaving the integer 4 and remainder 5
	Given User has entered 3
	And User has entered 6
	And User has entered 10
	When User runs '*/MOD'
	Then 1 should be on top 
	And 8 should be under 1
	And NumberStack should only have 2 numbers 

Scenario: Add integer 1 to integer 2, leaving sum integer 3
	Given User has entered 4
	And User has entered 9
	When User runs '+'
	Then 13 should be on top 
	And NumberStack should only have 1 number


Scenario: Subtract integer 2 from integer 1, leaving the difference  integer 3
	Given User has entered 20
	And User has entered 10
	When User runs '-'
	Then 10 should be on top 
	And NumberStack should only have 1 number

Scenario: Give me the absolute value of integer 1, leaving integer 2
	Given User has entered -80
	When User runs 'ABS'
	Then 80 should be on top 
	And NumberStack should only have 1 number

Scenario: Find if integer 1 or integer 2 is greater
	Given User has entered 30
	And User has entered 20
	When User runs 'MAX'
	Then 30 should be on top
	And NumberStack should only have 1 number

Scenario: Find if integer 1 or integer 2 is lesser
	Given User has entered 100
	And User has entered 300
	When User runs 'MIN'
	Then 100 should be on top
	And NumberStack should only have 1 number

Scenario: Negate the top integer, leaving the changed integer
	Given User has entered -10
	When User runs 'NEGATE'
	Then 10 should be on top
	And NumberStack should only have 1 number
