Feature: Fouth Emulator

Scenario Outline: <action> <int1> by <int2> leaving the <resultName> <resultInt>
	Given User has entered <int1>
	And User has entered <int2>
	When User runs <command>
	Then <resultInt> should be on top of NumberStack 
	And NumberStack should only have 1 number

Examples:
	| action   | command | int1 | int2 | resultName | resultInt |
	| Multiply | *	     | 2    | 3	   | product    | 6	    |
	| Divide   | /	     | 29   | 10   | quotient   | 2	    |
	| Add	   | +	     | 4    | 9	   | sum	| 13	    |
	| Subtract | -	     | 20   | 10   | difference | 10	    |

Scenario Outline: <action> <int1> by <command> leaving the <resultName> <resultInt>
	Given User has entered <int1>
	When User runs <command>
	Then <resultInt> should be on top of NumberStack
	And NumberStack should only have 1 number

Examples:
	| action      | command | int1 | resultName | resultInt |
	| One-minus   | 1-      | 3    | difference | 2		|
	| One-plus    | 1+      | 29   | sum	    | 30	|
	| Two-minus   | 2-      | 6    | difference | 4		|
	| Two-plus    | 2+      | 20   | sum	    | 22	|
	| 25-multiply | 25*     | 5    | product    | 125	|
	| 45-divide   | 30/     | 99   | quotient   | 3		|

Scenario: Multiply integer 1 by integer 2, creating result d. Then divide d by integer 3, leaving the integer 4. 
	Given User has entered 2 
	And User has entered 9
	And User has entered 10
	When User runs */
	Then 1 should be on top of NumberStack
	And NumberStack should only have 1 number

Scenario: Multiply integer 1 by integer 2, creating result d. Then divide d by integer 3, and leaving the integer 4 and remainder 5
	Given User has entered 3
	And User has entered 6
	And User has entered 10
	When User runs */MOD
	Then 1 should be on top of NumberStack 
	And 8 should be under 1
	And NumberStack should only have 2 numbers 

Scenario: Give me the absolute value of integer 1, leaving integer 2
	Given User has entered -80
	When User runs ABS
	Then 80 should be on top of NumberStack 
	And NumberStack should only have 1 number

Scenario: Find if integer 1 or integer 2 is greater
	Given User has entered 30
	And User has entered 20
	When User runs MAX
	Then 30 should be on top of NumberStack
	And NumberStack should only have 1 number

Scenario: Find if integer 1 or integer 2 is lesser
	Given User has entered 100
	And User has entered 300
	When User runs MIN
	Then 100 should be on top of NumberStack
	And NumberStack should only have 1 number

Scenario: Negate the top integer, leaving the changed integer
	Given User has entered -10
	When User runs NEGATE
	Then 10 should be on top of NumberStack
	And NumberStack should only have 1 number

Scenario: User prints integer 1
	Given User has entered 10
	When User runs .
	Then NumberStack should only have 0 numbers
	And 10 should be on top of DisplayStack
	And DisplayStack should only have 1 value

Scenario: User prints NumberStack
	Given User has entered 38
	And User has entered 46
	When User runs .S
	Then NumberStack should only have 2 numbers
	And DisplayStack should only have 2 values
	And DisplayStack should equal NumberStack

Scenario: User wishes to duplicate the top number on the NumberStack 
	Given User has entered 91
	And User has entered 60
	When User runs DUP
	Then NumberStack should only have 3 numbers
	And 60 should be on top of NumberStack

Scenario: User wishes to delete the top item on the NumberStack
	Given User has entered 37
	And User has entered 110
	And User has entered 16
	When user runs DROP
	Then NumberStack should only have 2 numbers
	And 110 should be on top of NumberStack

Scenario: User exchanges the top two numbers on the stack
	Given User has entered 1
	And User has entered 2
	And User has entered 3
	When User runs SWAP
	Then 2 should be on top of NumberStack
	And 3 should be under 2
	And NumberStack should only have 3 numbers

Scenario: User copies the second number to the top of the stack
	Given User has entered 4
	And User has entered 5
	And User has entered 6
	When user runs OVER
	Then 5 should be on top of NumberStack
	And 6 should be under 5
	And NumberStack should only have 4 numbers

Scenario: User wants to move 3 number number to the top of the stack
	Given User has entered 1
	And User has entered 2
	And User has entered 3
	And User has entered 4
	When User runs ROT
	Then NumberStack should only have 4 numbers
	And 2 should be on top of NumberStack
	And 4 should be under 2
	And 3 should be 3 positions from the top of NumberStack 

Scenario: User wants to use the top number to determine which number to copy to the top of the stack, not counting n itself. (i.e. the sequence 2 PICK is equivlent to OVER).
	Given User has entered 4
	And User has entered 5
	And User has entered 6
	And User has entered 7
	And User has entered 2
	When User runs PICK
	Then NumberStack should only have 6 numbers
	And 6 should be on top of NumberStack
	And 2 should be under 6
	And 6 should be 4 positions from the top of NumberStack
