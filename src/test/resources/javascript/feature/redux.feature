Feature: Fouth Emulator

Scenario Outline: <action> <int1> by <int2> leaving only the <resultName>
	Given User has entered <int1>
	And User has entered <int2>
	When User runs '<command>'
	Then 'NumberStack' should equal '<expectedResults>'
	And 'DisplayStack' should equal '[]'

Examples:
	| action	| command    | int1 | int2 | resultName | expectedResults |
	| Multiply	| *	     | 2    | 3	   | product    | [6]		  |
	| Divide	| /	     | 29   | 10   | quotient   | [2]		  |
	| Add		| +	     | 4    | 9	   | sum	| [13]		  |
	| Subtract	| -	     | 20   | 10   | difference | [10]		  |
	| Less Than	| <	     | 5    | 6	   | true flag	| [-1]		  |
	| Greater Than	| >	     | 7    | 3    | true flag	| [-1]		  |
	| Equal		| =	     | 4    | 4	   | true flag	| [-1]		  |
	| Not Equal	| <>	     | 50   | 20   | true flag	| [-1]		  |
	| Less Than	| <	     | 10   | 2	   | false flag	| [0]		  |
	| Greater Than	| >	     | 1    | 9    | false flag	| [0]		  |
	| Equal		| =	     | 8    | 4	   | false flag	| [0]		  |
	| Not Equal	| <>	     | 4    | 4    | false flag	| [0]		  |

Scenario Outline: <action> <int1> by <command> leaving only the <resultName>
	Given User has entered <int1>
	When User runs '<command>'
	Then 'NumberStack' should equal '<expectedResults>'
	And 'DisplayStack' should equal '[]'

Examples:
	| action	 | command | int1 | resultName	| expectedResults |
	| One-minus 	 | 1-      | 3    | difference	| [2]		  |
	| One-plus	 | 1+      | 29   | sum		| [30]		  |
	| Two-minus	 | 2-      | 6    | difference	| [4]		  |
	| Two-plus	 | 2+      | 20   | sum		| [22]		  |
	| 25-multiply	 | 25*     | 5    | product	| [125]		  |
	| 45-divide	 | 30/     | 99   | quotient	| [3]		  |
	| 0-less-than	 | 0<      | -5   | true flag	| [-1]		  |
	| 0-not-equal	 | 0<>     | 10   | true flag	| [-1]		  |
	| 0-equal	 | 0=      | 0    | true flag   | [-1]		  |
	| 0-greater-than | 0>      | 99   | true flag   | [-1]		  |

Scenario: Multiply integer 1 by integer 2, creating result d. Then divide d by integer 3, leaving the integer 4. 
	Given User has entered 2 
	And User has entered 9
	And User has entered 10
	When User runs '*/'
	Then 'NumberStack' should equal '[1]'
	And 'DisplayStack' should equal '[]'

Scenario: Multiply integer 1 by integer 2, creating result d. Then divide d by integer 3, and leaving the remainder 8 and integer 1
	Given User has entered 3
	And User has entered 6
	And User has entered 10
	When User runs '*/MOD'
	Then 'NumberStack' should equal '[8, 1]'
	And 'DisplayStack' should equal '[]'

Scenario: Give me the absolute value of integer 1, leaving integer 2
	Given User has entered -80
	When User runs 'ABS'
	Then 'NumberStack' should equal '[80]'
	And 'DisplayStack' should equal '[]'

Scenario: Find if integer 1 or integer 2 is greater
	Given User has entered 30
	And User has entered 20
	When User runs 'MAX'
	Then 'NumberStack' should equal '[30]'
	And 'DisplayStack' should equal '[]'

Scenario: Find if integer 1 or integer 2 is lesser
	Given User has entered 100
	And User has entered 300
	When User runs 'MIN'
	Then 'NumberStack' should equal '[100]'
	And 'DisplayStack' should equal '[]'

Scenario: Negate the top integer, leaving the changed integer
	Given User has entered -10
	When User runs 'NEGATE'
	Then 'NumberStack' should equal '[10]'
	And 'DisplayStack' should equal '[]'

Scenario: User prints integer 1
	Given User has entered 10
	When User runs '.'
	Then 'NumberStack' should equal '[]'
	And 'DisplayStack' should equal '[10]'

Scenario: User prints NumberStack
	Given User has entered 38
	And User has entered 46
	When User runs '.S'
	Then 'NumberStack' should equal '[38, 46]'
	And 'DisplayStack' should equal '[38, 46]'

Scenario: User wishes to duplicate the top number on the NumberStack 
	Given User has entered 91
	And User has entered 60
	When User runs 'DUP'
	Then 'NumberStack' should equal '[91, 60, 60]'
	And 'DisplayStack' should equal '[]'

Scenario: User wishes to delete the top item on the NumberStack
	Given User has entered 37
	And User has entered 110
	And User has entered 16
	When User runs 'DROP'
	Then 'NumberStack' should equal '[37, 110]'
	And 'DisplayStack' should equal '[]'

Scenario: User exchanges the top two numbers on the stack
	Given User has entered 1
	And User has entered 2
	And User has entered 3
	When User runs 'SWAP'
	Then 'NumberStack' should equal '[1, 3, 2]'
	And 'DisplayStack' should equal '[]'

Scenario: User copies the second number to the top of the stack
	Given User has entered 4
	And User has entered 5
	And User has entered 6
	When User runs 'OVER'
	Then 'NumberStack' should equal '[4, 5, 6, 5]'
	And 'DisplayStack' should equal '[]'

Scenario: User wants to move 3 number number to the top of the stack
	Given User has entered 1
	And User has entered 2
	And User has entered 3
	And User has entered 4
	When User runs 'ROT'
	Then 'NumberStack' should equal '[1, 3, 4, 2]'
	And 'DisplayStack' should equal '[]'

Scenario: User wants to use the top number to determine which number to copy to the top of the stack, not counting n itself. (i.e. the sequence 2 PICK is equivlent to OVER).
	Given User has entered 4
	And User has entered 5
	And User has entered 6
	And User has entered 7
	And User has entered 2
	When User runs 'PICK'
	Then 'NumberStack' should equal '[4, 5, 6, 7, 2, 6]'
	And 'DisplayStack' should equal '[]'

Scenario: User adds a TRUE flag and FALSE flag to the stack then NOTs the FALSE flag
	Given User runs 'TRUE'
	And User runs 'FALSE'
	When User runs 'NOT'
	Then 'NumberStack' should equal '[TRUE, TRUE]'
	And 'DisplayStack' should equal '[]'
	
Scenario: User adds a FALSE flag and TRUE flag to the stack then NOTs the TRUE flag
	Given User runs 'FALSE'
	And User runs 'TRUE'
	When User runs 'NOT'
	Then 'NumberStack' should equal '[FALSE, FALSE]'
	And 'DisplayStack' should equal '[]'

Scenario: User creates Constant quatro
	Given User runs '4'
	When User runs 'constant quatro'
	Then 'NumberStack' should equal '[]'
	And 'DisplayStack' should equal '[]'
	And 'quatro' should have a comment of '( -- 4)'

Scenario: User tries to create when no numbers are on stack
	When User runs 'constant uhOh'
	Then 'NumberStack' should equal '[]'
	And 'DisplayStack' should equal '["Stack Underflow"]'
	And 'UhOh' should not be added to the dictionary

Scenario Outline: User inputs several forth commands
	When User runs '<command>'
	Then '<stackName1>' should equal '<expectedValues1>'
	And '<stackName2>' should equal '<expectedValues2>'

Examples: 
	| command 			| stackName1	| expectedValues1 | stackName2	 | expectedValues2		|
	| 20 30 + 2 * 100 = .s  	| NumberStack	| [-1]		  | DisplayStack | [TRUE]			|
	| 5 9 + 3 *  5/ 8 = .		| NumberStack	| []		  | DisplayStack | [TRUE]			|
	| 2 3 4 */MOD			| NumberStack	| [2, 1]	  | DisplayStack | []				|
	| foo *				| NumberStack	| []		  | DisplayStack | ["foo ?"]			|
	| forget			| NumberStack	| []		  | DisplayStack | ["Unexpected end-of-line"]	|
	| forget t1			| NumberStack	| []		  | DisplayStack | ["t1 ?"]			|
	| if .s then			| NumberStack	| []		  | DisplayStack | ["Stack Underflow"]		|
	| 2 -1 if .s then		| NumberStack	| [2]		  | DisplayStack | [2]				|
	| 2 0 if .s else dup * then	| NumberStack	| [4]		  | DisplayStack | []				|
	| 8 0 dup if if do * .s if  then loop else min then else if dup then mod then dup *	| NumberStack	| []		  | DisplayStack | []				|
	| 8 -1 dup if if 2 0 do * .s if  then loop else min then else if dup then mod then dup *  	| NumberStack	| []		  | DisplayStack	| ["Stack Underflow", "Stack Underflow"]				|
	

Scenario Outline: User creates a new custom command. Which they use.
	When User runs '<command>' 
	Then '<customCommandNames>' should be added to the dictionary
	Then '<stackName>' should equal '<expectedValues>'
	And '<customCommandNames>' should have a comment of '<comments>'

Examples:
	| command				   | customCommandNames | stackName	| expectedValues | comments	|
	| : SQUARED ( n1 -- n2 ) DUP * ; 6 SQUARED | SQUARED		| NumberStack	| [36]		 | ( n1 -- n2 )	|
	| : DOZEN 12 ; DOZEN			   | DOZEN		| NumberStack	| [12]		 | 		|
	| ( : ignore words ; )			   | 			| NumberStack	| []		 | 		|
	| : 5 DUP * ; 4 5			   | 5			| NumberStack	| [16]		 |		|
	| 12 constant dozen dozen		   | DOZEN		| NumberStack	| [12]		 | ( -- 12)	|
	| 12 constant dozen			   | DOZEN		| NumberStack	| []		 | ( -- 12)	|


Scenario: User wants to forget a custom command
	When User runs ': SQUARED DUP * ;'
	And User runs ': t1 ;'
	And User runs '12 constant dozen'
	And User runs ': gross dozen squared ;'
	And User runs 'gross'
	When User runs 'forget t1 squared gross'
	Then 'NumberStack' should equal '[20736]'
	And 'DisplayStack' should equal '["gross ?"]'
	And 'squared' should be added to the dictionary
	And 'dozen' should not be added to the dictionary
	And 'gross' should not be added to the dictionary

Scenario: User conditionally wants datastack printed console
	Given User has entered 2
	And User has entered -1
	When User runs 'if .s then'
	Then 'NumberStack' should equal '[2]'
	And 'DisplayStack' should equal '[2]'

Scenario: User prints to console the index of a loop squared
	When User runs ': squared dup * ; 5 0 do i squared . loop'
	Then 'NumberStack' should equal '[]'
	And 'DisplayStack' should equal '[0, 1, 4, 9, 16]'
