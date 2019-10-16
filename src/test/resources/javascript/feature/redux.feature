Feature: Fouth Emulator

Scenario Outline: <action> <int1> by <int2> leaving the <resultName> <resultInt>
	Given User has entered <int1>
	And User has entered <int2>
	When User runs <command>
	Then <resultInt> should be on top of NumberStack 
	And NumberStack should only have 1 number

Examples:
	| action	| command    | int1 | int2 | resultName | resultInt |
	| Multiply	| *	     | 2    | 3	   | product    | 6	    |
	| Divide	| /	     | 29   | 10   | quotient   | 2	    |
	| Add		| +	     | 4    | 9	   | sum	| 13	    |
	| Subtract	| -	     | 20   | 10   | difference | 10	    |
	| Less Than	| <	     | 5    | 6	   | true flag	| -1	    |
	| Greater Than	| >	     | 7    | 3    | true flag	| -1	    |
	| Equal		| =	     | 4    | 4	   | true flag	| -1	    |
	| Not Equal	| <>	     | 50   | 20   | true flag	| -1	    |
	| Less Than	| <	     | 10   | 2	   | false flag	| 0 	    |
	| Greater Than	| >	     | 1    | 9    | false flag	| 0	    |
	| Equal		| =	     | 8    | 4	   | false flag	| 0	    |
	| Not Equal	| <>	     | 4    | 4    | false flag	| 0	    |

Scenario Outline: <action> <int1> by <command> leaving the <resultName> <resultInt>
	Given User has entered <int1>
	When User runs <command>
	Then <resultInt> should be on top of NumberStack
	And NumberStack should only have 1 number

Examples:
	| action	 | command | int1 | resultName	| resultInt |
	| One-minus 	 | 1-      | 3    | difference	| 2	    |
	| One-plus	 | 1+      | 29   | sum		| 30	    |
	| Two-minus	 | 2-      | 6    | difference	| 4	    |
	| Two-plus	 | 2+      | 20   | sum		| 22	    |
	| 25-multiply	 | 25*     | 5    | product	| 125	    |
	| 45-divide	 | 30/     | 99   | quotient	| 3	    |
	| 0-less-than	 | 0<      | -5   | true flag	| -1	    |
	| 0-not-equal	 | 0<>     | 10   | true flag	| -1	    |
	| 0-equal	 | 0=      | 0    | true flag   | -1	    |
	| 0-greater-than | 0>      | 99   | true flag   | -1	    |

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

Scenario: User adds a TRUE flag and FALSE flag to the stack then NOTs the FALSE flag
	Given User runs TRUE
	And User runs FALSE
	When User runs NOT
	Then TRUE should be on top of NumberStack
	And TRUE should be 1 position from the top of NumberStack
	And NumberStack should only have 2 numbers
	
Scenario: User adds a FALSE flag and TRUE flag to the stack then NOTs the TRUE flag
	Given User runs FALSE
	And User runs TRUE
	When User runs NOT
	Then FALSE should be on top of NumberStack
	And FALSE should be 1 position from the top of NumberStack
	And NumberStack should only have 2 numbers

Scenario Outline: User inputs several forth commands
	When User runs '<command>'
	Then <valueOnTop1> should be on top of <stackName1>
	And <stackName1> should only have <totalValues1> numbers
	And '<valueOnTop2>' should be on top of <stackName2>
	And <stackName2> should only have <totalValues2> values
	And Both stacks are '<doStacksMatch>'

Examples: 
	| command 		| stackName1	| totalValues1	| valueOnTop1	| stackName2 	| totalValues2 	| valueOnTop2	| doStacksMatch |
	| 20 30 + 2 * 100 = .s  | NumberStack	| 1		| TRUE		| DisplayStack	| 1		| TRUE		| same		|
	| 5 9 + 3 *  5/ 8 = .	| NumberStack	| 0		| undefined	| DisplayStack	| 1		| TRUE		| different	| 
	| 2 3 4 */MOD		| NumberStack	| 2		| 1		| DisplayStack	| 0		| undefined	| different	|
	| foo *			| NumberStack	| 0		| undefined	| DisplayStack	| 1		| foo ?		| different	|

Scenario Outline: User creates a new custom command. Which they use.
	When User runs '<command>' 
	Then '<customCommandNames>' should be added to the dictionary
	And <valueOnTop> should be on top of <stackName>
	And <stackName> should only have <totalValues> number
	And '<customCommandNames>' should have a comment of '<comments>'

Examples:
	| command				   | customCommandNames | valueOnTop	| stackName	| totalValues	| comments	|
	| : SQUARED ( n1 -- n2 ) DUP * ; 6 SQUARED | SQUARED		| 36		| NumberStack	| 1		| ( n1 -- n2 )	|
	| : DOZEN 12 ; DOZEN			   | DOZEN		| 12		| NumberStack	| 1		| 		|
	| ( : ignore words ; )			   |			| undefined	| NumberStack	| 0		| 		|
	| : 5 DUP * ; 4 5			   | 5			| 16		| NumberStack	| 1		|		|

