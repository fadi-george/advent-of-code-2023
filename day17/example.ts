type RockPaperScissors = '👊🏻' | '🖐🏾' | '✌🏽';

type WinningHand = {
	'👊🏻🖐🏾': false,
  '👊🏻✌🏽': true,
  '👊🏻👊🏻': false,
  '🖐🏾👊🏻': true,
  '🖐🏾✌🏽': false,
  '🖐🏾🖐🏾': false,
  '✌🏽👊🏻': false,
  '✌🏽🖐🏾': true,
  '✌🏽✌🏽': false,
}

type WhoWins<P1 extends RockPaperScissors, P2 extends RockPaperScissors> =
? P1 extends ;
