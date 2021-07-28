import { OpCodes } from './constants';

export const binaryOperatorMap = {
  '>=': OpCodes.Gte,
  '>': OpCodes.Gt,
  '<=': OpCodes.Lte,
  '<': OpCodes.Lt,
  '==': OpCodes.Equal,
  '!=': OpCodes.NotEqual,
  '+': OpCodes.Add,
  '-': OpCodes.Sub,
  '*': OpCodes.Mul,
  '/': OpCodes.Div,
  '%': OpCodes.Mod,
  xor: OpCodes.Xor,
  and: OpCodes.And,
  or: OpCodes.Or,
};

export const unaryOperatorMap = {
  not: OpCodes.Not,
  inc: OpCodes.Inc,
  dec: OpCodes.Dec,
};
