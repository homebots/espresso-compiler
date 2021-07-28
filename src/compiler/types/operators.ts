import { OpCodes } from './constants';

export const binaryOperatorMap = {
  '>=': OpCodes.Gte,
  '>': OpCodes.Gt,
  '<=': OpCodes.Lte,
  '<': OpCodes.Lt,
  '==': OpCodes.Equal,
  '!=': OpCodes.NotEqual,
  xor: OpCodes.Xor,
  and: OpCodes.And,
  or: OpCodes.Or,
  '+': OpCodes.Add,
  '-': OpCodes.Sub,
  '*': OpCodes.Mul,
  '/': OpCodes.Div,
  '%': OpCodes.Mod,
};

export const unaryOperatorMap = {
  not: OpCodes.Not,
  inc: OpCodes.Inc,
  dec: OpCodes.Dec,
};
