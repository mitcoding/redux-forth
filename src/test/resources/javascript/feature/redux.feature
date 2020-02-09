Feature: Fouth Emulator

Scenario Outline: <action> <int1> by <int2> leaving only the <resultName>
	Given User has entered <int1>
	And User has entered <int2>
	When User runs '<command>'
	Then 'IntegerStack' should equal <expectedResults>
	And 'DisplayStack' should equal ["ok", " ", <int1>, "\r", "ok", " ", <int2>, "\r", "ok", " ", "<command>", "\r", "ok", " "]

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
	Then 'IntegerStack' should equal <expectedResults>
	And 'DisplayStack' should equal ["ok", " ", <int1>, "\r", "ok", " ", "<command>", "\r", "ok", " "]

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
	Then 'IntegerStack' should equal [1]
	And 'DisplayStack' should equal ["ok", " ", 2, "\r", "ok", " ", 9, "\r", "ok", " ", 10, "\r", "ok", " ", "*/", "\r", "ok", " "]

Scenario: Multiply integer 1 by integer 2, creating result d. Then divide d by integer 3, and leaving the remainder 8 and integer 1
	Given User has entered 3
	And User has entered 6
	And User has entered 10
	When User runs '*/MOD'
	Then 'IntegerStack' should equal [8, 1]
	And 'DisplayStack' should equal ["ok", " ", 3, "\r", "ok", " ", 6, "\r", "ok", " ", 10, "\r", "ok", " ", "*/MOD", "\r", "ok", " "]

Scenario: Give me the absolute value of integer 1, leaving integer 2
	Given User has entered -80
	When User runs 'ABS'
	Then 'IntegerStack' should equal [80]
	And 'DisplayStack' should equal ["ok", " ", -80, "\r", "ok", " ", "ABS", "\r", "ok", " "]

Scenario: Find if integer 1 or integer 2 is greater
	Given User has entered 30
	And User has entered 20
	When User runs 'MAX'
	Then 'IntegerStack' should equal [30]
	And 'DisplayStack' should equal ["ok", " ", 30, "\r", "ok", " ", 20, "\r", "ok", " ", "MAX", "\r", "ok", " "]

Scenario: Find if integer 1 or integer 2 is lesser
	Given User has entered 100
	And User has entered 300
	When User runs 'MIN'
	Then 'IntegerStack' should equal [100]
	And 'DisplayStack' should equal ["ok", " ", 100, "\r", "ok", " ", 300, "\r", "ok", " ", "MIN", "\r", "ok", " "]

Scenario: Negate the top integer, leaving the changed integer
	Given User has entered -10
	When User runs 'NEGATE'
	Then 'IntegerStack' should equal [10]
	And 'DisplayStack' should equal ["ok", " ", -10, "\r", "ok", " ", "NEGATE", "\r", "ok", " "]

Scenario: User prints integer 1
	Given User has entered 10
	When User runs '.'
	Then 'IntegerStack' should equal []
	And 'DisplayStack' should equal ["ok", " ", 10, "\r", "ok", " ", ".", "\r", 10, " ", "\r", "ok", " "]

Scenario: User prints IntegerStack
	Given User has entered 38
	And User has entered 46
	When User runs '.S'
	Then 'IntegerStack' should equal [38, 46]
	And 'DisplayStack' should equal ["ok", " ", 38, "\r", "ok", " ", 46, "\r", "ok", " ", ".S", "\r", 38, " ", 46, " ", "\r", "ok", " "]

Scenario: User wishes to duplicate the top number on the IntegerStack 
	Given User has entered 91
	And User has entered 60
	When User runs 'DUP'
	Then 'IntegerStack' should equal [91, 60, 60]
	And 'DisplayStack' should equal ["ok", " ", 91, "\r", "ok", " ", 60, "\r", "ok", " ", "DUP", "\r", "ok", " "]

Scenario: User wishes to delete the top item on the IntegerStack
	Given User has entered 37
	And User has entered 110
	And User has entered 16
	When User runs 'DROP'
	Then 'IntegerStack' should equal [37, 110]
	And 'DisplayStack' should equal ["ok", " ", 37, "\r", "ok", " ", 110, "\r", "ok", " ", 16, "\r", "ok", " ", "DROP", "\r", "ok", " "]

Scenario: User exchanges the top two numbers on the stack
	Given User has entered 1
	And User has entered 2
	And User has entered 3
	When User runs 'SWAP'
	Then 'IntegerStack' should equal [1, 3, 2]
	And 'DisplayStack' should equal ["ok", " ", 1, "\r", "ok", " ", 2, "\r", "ok", " ", 3, "\r", "ok", " ", "SWAP", "\r", "ok", " "]

Scenario: User copies the second number to the top of the stack
	Given User has entered 4
	And User has entered 5
	And User has entered 6
	When User runs 'OVER'
	Then 'IntegerStack' should equal [4, 5, 6, 5]
	And 'DisplayStack' should equal ["ok", " ", 4, "\r", "ok", " ", 5, "\r", "ok", " ", 6, "\r", "ok", " ", "OVER", "\r", "ok", " "]

Scenario: User wants to move 3 number number to the top of the stack
	Given User has entered 1
	And User has entered 2
	And User has entered 3
	And User has entered 4
	When User runs 'ROT'
	Then 'IntegerStack' should equal [1, 3, 4, 2]
	And 'DisplayStack' should equal ["ok", " ", 1, "\r", "ok", " ", 2, "\r", "ok", " ", 3, "\r", "ok", " ", 4, "\r", "ok", " ", "ROT", "\r", "ok", " "]

Scenario: User wants to use the top number to determine which number to copy to the top of the stack, not counting n itself. (i.e. the sequence 2 PICK is equivlent to OVER).
	Given User has entered 4
	And User has entered 5
	And User has entered 6
	And User has entered 7
	And User has entered 2
	When User runs 'PICK'
	Then 'IntegerStack' should equal [4, 5, 6, 7, 2, 6]
	And 'DisplayStack' should equal ["ok", " ", 4, "\r", "ok", " ", 5, "\r", "ok", " ", 6, "\r", "ok", " ", 7, "\r", "ok", " ", 2, "\r", "ok", " ", "PICK", "\r", "ok", " "]

Scenario: User adds a TRUE flag and FALSE flag to the stack then NOTs the FALSE flag
	Given User runs 'TRUE'
	And User runs 'FALSE'
	When User runs 'NOT'
	Then 'IntegerStack' should equal [TRUE, TRUE]
	And 'DisplayStack' should equal ["ok", " ", "TRUE", "\r", "ok", " ", "FALSE", "\r", "ok", " ", "NOT", "\r", "ok", " "]
	
Scenario: User adds a FALSE flag and TRUE flag to the stack then NOTs the TRUE flag
	Given User runs 'FALSE'
	And User runs 'TRUE'
	When User runs 'NOT'
	Then 'IntegerStack' should equal [FALSE, FALSE]
	And 'DisplayStack' should equal ["ok", " ", "FALSE", "\r", "ok", " ", "TRUE", "\r", "ok", " ", "NOT", "\r", "ok", " "]

Scenario: User creates Constant quatro
	Given User runs '4'
	When User runs 'constant quatro'
	Then 'IntegerStack' should equal []
	And 'DisplayStack' should equal ["ok", " ", 4, "\r", "ok", " ", "constant quatro", "\r", "ok", " "]
	And 'quatro' should have a comment of '( -- 4)'

Scenario: User tries to create a constant when no numbers are on the IntegerStack
	When User runs 'constant uhOh'
	Then 'IntegerStack' should equal []
	And 'DisplayStack' should equal ["ok", " ", "constant uhOh", "\r", "Stack Underflow", "\r", "ok", " "]
	And 'UhOh' should not be added to the dictionary

Scenario Outline: User want's to print a charector by char code.
	Given User runs '<charCode>'
	When User runs 'EMIT'
	Then 'IntegerStack' should equal <expectedValues1>
	And 'DisplayStack' should equal <exepectedValues2>

Examples:
	| charCode	| expectedValues1 | exepectedValues2										|
	| 33		| []			  | ["ok", " ", 33, "\r", "ok", " ", "EMIT", "\r", "!", "\r", "ok", " "]	|
	| 34		| []			  | ["ok", " ", 34, "\r", "ok", " ", "EMIT", "\r", "\"", "\r", "ok", " "]	|
	| 35		| []			  | ["ok", " ", 35, "\r", "ok", " ", "EMIT", "\r", "#", "\r", "ok", " "]	|
	| 36		| []			  | ["ok", " ", 36, "\r", "ok", " ", "EMIT", "\r", "$", "\r", "ok", " "]	|
	| 37		| []			  | ["ok", " ", 37, "\r", "ok", " ", "EMIT", "\r", "%", "\r", "ok", " "]	|
	| 38		| []			  | ["ok", " ", 38, "\r", "ok", " ", "EMIT", "\r", "&", "\r", "ok", " "]	|
	| 42		| []			  | ["ok", " ", 42, "\r", "ok", " ", "EMIT", "\r", "*", "\r", "ok", " "]	|
	|   		| []			  | ["ok", " ", "EMIT", "\r", "Stack Underflow", "\r", "ok", " "]		|

Scenario Outline: User inputs several forth commands
	When User runs '<command>'
	Then '<stackName1>' should equal <expectedValues1>
	And '<stackName2>' should equal <expectedValues2>

Examples: 
	| command						| stackName1	| expectedValues1 | stackName2	 | expectedValues2		  |
	| 20 30 + 2 * 100 = .s					| IntegerStack	| [-1]		  | DisplayStack | ["ok", " ", "20 30 + 2 * 100 = .s", "\r", TRUE, " ", "\r", "ok", " "]			  |
	| 5 9 + 3 *  5/ 8 = .					| IntegerStack	| []		  | DisplayStack | ["ok", " ", "5 9 + 3 *  5/ 8 = .", "\r", TRUE, " ", "\r", "ok", " "]			  |
	| 2 3 4 */MOD						| IntegerStack	| [2, 1]	  | DisplayStack | ["ok", " ", "2 3 4 */MOD", "\r", "ok", " "]				  |
	| foo *							| IntegerStack	| []		  | DisplayStack | ["ok", " ", "foo *", "\r", "foo ?", "\r", "ok", " "]			  |
	| forget						| IntegerStack	| []		  | DisplayStack | ["ok", " ", "forget", "\r", "Unexpected end-of-line", "\r", "ok", " "]	  |
	| forget t1						| IntegerStack	| []		  | DisplayStack | ["ok", " ", "forget t1", "\r", "t1 ?", "\r", "ok", " "]			  |
	| if .s then						| IntegerStack	| []		  | DisplayStack | ["ok", " ", "if .s then", "\r", "Stack Underflow", "\r", "ok", " "]		  |
	| : if ; if 12 then					| IntegerStack	| [12]		  | DisplayStack | ["ok", " ", ": if ; if 12 then", "\r", "Control structure mismatch", "\r", "ok", " "] |
	| : if ; if else 144 then				| IntegerStack	| []		  | DisplayStack | ["ok", " ", ": if ; if else 144 then", "\r", "Control structure mismatch", "\r", "ok", " "] |
	| : do ; -1 if do 12 loop then				| IntegerStack	| [-1]		  | DisplayStack | ["ok", " ", ": do ; -1 if do 12 loop then", "\r", "Control structure mismatch", "\r", "IF 1 ]", " "] |
	| : foo .s then						| IntegerStack	| []		  | DisplayStack | ["ok", " ", ": foo .s then", "\r", "Control structure mismatch", "\r", ": 1 ]", " "] |
	| 5 0 do .s ;						| IntegerStack	| [5, 0]	  | DisplayStack | ["ok", " ", "5 0 do .s ;", "\r", "Control structure mismatch", "\r", "DO 1 ]", " "] |
	| -1 2 constant two if forget two then two 		| IntegerStack	| []		  | DisplayStack | ["ok", " ", "-1 2 constant two if forget two then two", "\r", "two ?", "\r", "ok", " "]			  |
	| 0 2 constant two if forget two then two  		| IntegerStack	| [2]		  | DisplayStack | ["ok", " ", "0 2 constant two if forget two then two", "\r", "ok", " "]				  |
	| 2 -1 if constant two then two		   		| IntegerStack	| [2]		  | DisplayStack | ["ok", " ", "2 -1 if constant two then two", "\r", "ok", " "]				  |
	| 2 0 if constant two then two		   		| IntegerStack	| [2]		  | DisplayStack | ["ok", " ", "2 0 if constant two then two", "\r", "two ?", "\r", "ok", " "]			  |
	| 2 -1 if .s then			   		| IntegerStack	| [2]		  | DisplayStack | ["ok", " ", "2 -1 if .s then", "\r", 2, " ", "\r", "ok", " "]				  |
	| 2 0 if .s else dup * then		   		| IntegerStack	| [4]		  | DisplayStack | ["ok", " ", "2 0 if .s else dup * then", "\r", "ok", " "]				  |
	| 10 : t1 ; : dup 122 ; : dup dup * ; dup forget t1 dup	| IntegerStack	| [1220, 1220]	  | DisplayStack | ["ok", " ", "10 : t1 ; : dup 122 ; : dup dup * ; dup forget t1 dup", "\r", "ok", " "]				  |
	| 2 : t1 ; : dup 122 ; : dup dup * ; dup forget dup dup	| IntegerStack	| [244, 122]	  | DisplayStack | ["ok", " ", "2 : t1 ; : dup 122 ; : dup dup * ; dup forget dup dup", "\r", "ok", " "]				  |
	| 8 0 dup if if do * .s if  then loop else min then else if dup then mod then dup * 	 | IntegerStack	| [] | DisplayStack | ["ok", " ", "8 0 dup if if do * .s if  then loop else min then else if dup then mod then dup *", "\r", "ok", " "]	  |
	| 8 -1 dup if if 2 0 do * .s if  then loop else min then else if dup then mod then dup * | IntegerStack	| [] | DisplayStack | ["ok", " ", "8 -1 dup if if 2 0 do * .s if  then loop else min then else if dup then mod then dup *", "\r", "Empty", "\r", "Stack Underflow", "\r", "Empty", "\r", "Stack Underflow", "\r", "ok", " "] |		
	
Scenario: User creates command to print a message
	When User runs ': GIFT ." bookends " ;' 
	And User runs ': GIVER ." Amanda " ;' 
	And User runs ': THANKS ." Dear  " GIVER ." , " CR ." thanks for the  " GIFT ." . " ;'
	And User runs ': GIVER ." Eliana " ;'
	And User runs 'THANKS'
	Then 'DisplayStack' should equal ["ok", " ", ": GIFT .\" bookends \" ;", "\r", "ok", " ", ": GIVER .\" Amanda \" ;", "\r", "ok", " ", ": THANKS .\" Dear  \" GIVER .\" , \" CR .\" thanks for the  \" GIFT .\" . \" ;", "\r", "ok", " ", ": GIVER .\" Eliana \" ;", "\r", "ok", " ", "THANKS", "\r", "Dear", " ", "Amanda", " ", ",", " ", "\r", "thanks for the", " ", "bookends", " ", ".", " ", "\r", "ok", " "]
	And 'IntegerStack' should equal []

Scenario Outline: User creates a new custom command. Which they use.
	When User runs '<command>' 
	Then '<customCommandNames>' should be added to the dictionary
	Then '<stackName>' should equal <expectedValues>
	And '<customCommandNames>' should have a comment of '<comments>'

Examples:
	| command				   | customCommandNames | stackName	| expectedValues | comments	|
	| : SQUARED ( n1 -- n2 ) DUP * ; 6 SQUARED | SQUARED		| IntegerStack	| [36]		 | ( n1 -- n2 )	|
	| : DOZEN 12 ; DOZEN			   | DOZEN		| IntegerStack	| [12]		 | 		|
	| : 5 DUP * ; 4 5			   | 5			| IntegerStack	| [16]		 |		|
	| 12 constant dozen dozen		   | DOZEN		| IntegerStack	| [12]		 | ( -- 12)	|
	| 12 constant dozen			   | DOZEN		| IntegerStack	| []		 | ( -- 12)	|

Scenario: User comments out a custom word defintion
	When User runs '( : ignore words ; )'
	Then 'ignore' should not be added to the dictionary
	And 'IntegerStack' should equal []
	And 'DisplayStack' should equal ["ok", " ", "( : ignore words ; )", "\r", "ok", " "]

Scenario: User wants to forget a custom command
	When User runs ': SQUARED DUP * ;'
	And User runs ': t1 ;'
	And User runs '12 constant dozen'
	And User runs ': gross dozen squared ;'
	And User runs 'gross'
	When User runs 'forget t1 squared gross'
	Then 'IntegerStack' should equal [20736]
	And 'DisplayStack' should equal ["ok", " ", ": SQUARED DUP * ;", "\r", "ok", " ", ": t1 ;", "\r", "ok", " ", "12 constant dozen", "\r", "ok", " ", ": gross dozen squared ;", "\r", "ok", " ", "gross", "\r", "ok", " ", "forget t1 squared gross", "\r", "gross ?", "\r", "ok", " "]
	And 'squared' should be added to the dictionary
	And 'dozen' should not be added to the dictionary
	And 'gross' should not be added to the dictionary

Scenario: User conditionally wants datastack printed console
	Given User has entered 2
	And User has entered -1
	When User runs 'if .s then'
	Then 'IntegerStack' should equal [2]
	And 'DisplayStack' should equal ["ok", " ", 2, "\r", "ok", " ", -1, "\r", "ok", " ", "if .s then", "\r", 2, " ", "\r", "ok", " "]

Scenario: User prints to console the index of a loop squared
	When User runs ': squared dup * ; 5 0 do i squared . loop'
	Then 'IntegerStack' should equal []
	And 'DisplayStack' should equal ["ok", " ", ": squared dup * ; 5 0 do i squared . loop", "\r", 0, " ", 1, " ", 4, " ", 9, " ", 16, " ", "\r", "ok", " "]

Scenario Outline: User wants to know if egg size is large enough
	Given User runs ': eggsize'
	And User runs 'dup 18 < if ." reject " else'
	And User runs 'dup 21 < if ." small " else'
	And User runs 'dup 24 < if ." medium " else'
	And User runs 'dup 27 < if ." large " else'
	And User runs 'dup 30 < if ." extra large " else'
	And User runs '." error "'
	And User runs 'then then then then then drop ;'
	When User runs '<command>'
	Then 'IntegerStack' should equal []
	And 'DisplayStack' should equal <expectedValue>

Examples:
	| command		| expectedValue																																																																																													|
	| 17 eggsize	| ["ok", " ", ": eggsize","\r", ": 1 ]", " ", "dup 18 < if .\" reject \" else", "\r", "IF 2 ]", " ", "dup 21 < if .\" small \" else", "\r", "IF 3 ]", " ", "dup 24 < if .\" medium \" else", "\r", "IF 4 ]", " ", "dup 27 < if .\" large \" else", "\r", "IF 5 ]", " ", "dup 30 < if .\" extra large \" else", "\r", "IF 6 ]", " ", ".\" error \"", "\r", "IF 6 ]", " ", "then then then then then drop ;", "\r", "ok", " ", "17 eggsize", "\r", "reject", " ", "\r", "ok", " "]		|
	| 20 eggsize	| ["ok", " ", ": eggsize","\r", ": 1 ]", " ", "dup 18 < if .\" reject \" else", "\r", "IF 2 ]", " ", "dup 21 < if .\" small \" else", "\r", "IF 3 ]", " ", "dup 24 < if .\" medium \" else", "\r", "IF 4 ]", " ", "dup 27 < if .\" large \" else", "\r", "IF 5 ]", " ", "dup 30 < if .\" extra large \" else", "\r", "IF 6 ]", " ", ".\" error \"", "\r", "IF 6 ]", " ", "then then then then then drop ;", "\r", "ok", " ", "20 eggsize", "\r", "small", " ", "\r", "ok", " "]		|
	| 23 eggsize	| ["ok", " ", ": eggsize","\r", ": 1 ]", " ", "dup 18 < if .\" reject \" else", "\r", "IF 2 ]", " ", "dup 21 < if .\" small \" else", "\r", "IF 3 ]", " ", "dup 24 < if .\" medium \" else", "\r", "IF 4 ]", " ", "dup 27 < if .\" large \" else", "\r", "IF 5 ]", " ", "dup 30 < if .\" extra large \" else", "\r", "IF 6 ]", " ", ".\" error \"", "\r", "IF 6 ]", " ", "then then then then then drop ;", "\r", "ok", " ", "23 eggsize", "\r", "medium", " ", "\r", "ok", " "]		|
	| 26 eggsize	| ["ok", " ", ": eggsize","\r", ": 1 ]", " ", "dup 18 < if .\" reject \" else", "\r", "IF 2 ]", " ", "dup 21 < if .\" small \" else", "\r", "IF 3 ]", " ", "dup 24 < if .\" medium \" else", "\r", "IF 4 ]", " ", "dup 27 < if .\" large \" else", "\r", "IF 5 ]", " ", "dup 30 < if .\" extra large \" else", "\r", "IF 6 ]", " ", ".\" error \"", "\r", "IF 6 ]", " ", "then then then then then drop ;", "\r", "ok", " ", "26 eggsize", "\r", "large", " ", "\r", "ok", " "]		|
	| 29 eggsize	| ["ok", " ", ": eggsize","\r", ": 1 ]", " ", "dup 18 < if .\" reject \" else", "\r", "IF 2 ]", " ", "dup 21 < if .\" small \" else", "\r", "IF 3 ]", " ", "dup 24 < if .\" medium \" else", "\r", "IF 4 ]", " ", "dup 27 < if .\" large \" else", "\r", "IF 5 ]", " ", "dup 30 < if .\" extra large \" else", "\r", "IF 6 ]", " ", ".\" error \"", "\r", "IF 6 ]", " ", "then then then then then drop ;", "\r", "ok", " ", "29 eggsize", "\r", "extra large", " ", "\r", "ok", " "]	|
	| 30 eggsize	| ["ok", " ", ": eggsize","\r", ": 1 ]", " ", "dup 18 < if .\" reject \" else", "\r", "IF 2 ]", " ", "dup 21 < if .\" small \" else", "\r", "IF 3 ]", " ", "dup 24 < if .\" medium \" else", "\r", "IF 4 ]", " ", "dup 27 < if .\" large \" else", "\r", "IF 5 ]", " ", "dup 30 < if .\" extra large \" else", "\r", "IF 6 ]", " ", ".\" error \"", "\r", "IF 6 ]", " ", "then then then then then drop ;", "\r", "ok", " ", "30 eggsize", "\r", "error", " ", "\r", "ok", " "]		|


Scenario Outline: User wants to know if box size is large enough
	Given User runs ': boxtest 6 >  ROT 22 >  ROT 19 >  AND AND IF ." Big enough " THEN ;'
	When User runs '<command>'
	Then 'IntegerStack' should equal []
	And 'DisplayStack' should equal <expectedResults>

Examples:
	| command		   | expectedResults																																	|
	| 23 20 7 BOXTEST  | ["ok", " ", ": boxtest 6 >  ROT 22 >  ROT 19 >  AND AND IF .\" Big enough \" THEN ;", "\r", "ok", " ", "23 20 7 BOXTEST", "\r", "Big enough", " ", "\r", "ok", " "]	|
	| 23 20 6 BOXTEST  | ["ok", " ", ": boxtest 6 >  ROT 22 >  ROT 19 >  AND AND IF .\" Big enough \" THEN ;", "\r", "ok", " ", "23 20 6 BOXTEST", "\r", "ok", " "]						|
	| 23 19 7 BOXTEST  | ["ok", " ", ": boxtest 6 >  ROT 22 >  ROT 19 >  AND AND IF .\" Big enough \" THEN ;", "\r", "ok", " ", "23 19 7 BOXTEST", "\r", "ok", " "]						|
	| 22 20 7 BOXTEST  | ["ok", " ", ": boxtest 6 >  ROT 22 >  ROT 19 >  AND AND IF .\" Big enough \" THEN ;", "\r", "ok", " ", "22 20 7 BOXTEST", "\r", "ok", " "]						|
	| 22 19 6 BOXTEST  | ["ok", " ", ": boxtest 6 >  ROT 22 >  ROT 19 >  AND AND IF .\" Big enough \" THEN ;", "\r", "ok", " ", "22 19 6 BOXTEST", "\r", "ok", " "]						|
	| 25 21 10 BOXTEST | ["ok", " ", ": boxtest 6 >  ROT 22 >  ROT 19 >  AND AND IF .\" Big enough \" THEN ;", "\r", "ok", " ", "25 21 10 BOXTEST", "\r", "Big enough", " ", "\r", "ok", " "]	|

Scenario Outline: User wants ability to do boolean logic
	When User runs '<command>'
	Then 'IntegerStack' should equal <expectedValue>

Examples:
	| command	| expectedValue |
	| -1 -1 and	| [-1]		|
	| 0 -1 and	| [0]		|
	| 0 0 and	| [0]		|
	| -1 0 and	| [0]		|
	| -1 -1 or	| [-1]		|
	| 0 -1 or	| [-1]		|
	| 0 0 or	| [0]		|
	| -1 0 or	| [-1]		|

Scenario: User wants ability to clear the display
	Given User runs '20 30 40 .s'
	When User runs 'page'
	Then 'IntegerStack' should equal [20, 30, 40]
	And 'DisplayStack' should equal ["ok", " "]

Scenario: User wants to print a large F with *
	Given User runs ': space 32 emit ;'
	And User runs ': spaces 0 do space loop ;'
	And User runs ': star 42 emit ;'
	And User runs ': stars 0 do star loop ;'
	And User runs ': margin cr 30 spaces ;'
	And User runs ': blip margin star ;'
	And User runs ': bar margin 5 stars ;'
	And User runs ': f bar blip bar blip blip ;'
	When User runs 'F'
	Then 'IntegerStack' should equal []
	Then 'DisplayStack' should equal ["ok", " ", ": space 32 emit ;", "\r", "ok", " ", ": spaces 0 do space loop ;", "\r", "ok", " ", ": star 42 emit ;", "\r", "ok", " ", ": stars 0 do star loop ;", "\r", "ok", " ", ": margin cr 30 spaces ;", "\r", "ok", " ", ": blip margin star ;", "\r", "ok", " ", ": bar margin 5 stars ;", "\r", "ok", " ", ": f bar blip bar blip blip ;", "\r", "ok", " ", "F", "\r", "\r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "*", "*", "*", "*", "*", "\r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "*", "\r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "*", "*", "*", "*", "*", "\r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "*", "\r", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "*", "\r", "ok", " "]