import { Args } from "./parser";

export type Flag<T, N extends string> = (args: Args) => { [key in N]: T };
export type NumberFlag<N extends string> = Flag<number, N>;
export type StringFlag<N extends string> = Flag<string, N>;
export type BooleanFlag<N extends string> = Flag<boolean, N>;

export function makeNumberFlag<N extends string>(
  name: N,
  alias?: string
): NumberFlag<N> {
  return (args: Args) => {
    let v = args[name];
    if (!v && alias) {
      v = args[alias];
    }
    return <any>{ [name]: parseInt(v, 10) };
  };
}

export function makeStringFlag<N extends string>(name: N, alias?: string): StringFlag<N> {
  return (args: Args) => {
    const v = args[name];
    if (!v && alias) {
      return <any>{ [name]: args[alias] };
    }
    return <any>{ [name]: v };
  };
}

export function makeBooleanFlag<N extends string>(name: N, alias?: string): BooleanFlag<N> {
  return (args: Args) => {
    if (args[name]) {
      return <any>{ [name]: true };
    }
    const v = args[name];
    if (!v && alias) {
      return <any>{ [name]: args[alias] };
    }
    return <any>{ [name]: false };
  };
}

export function compose<T1, T1Name extends string, T2, T2Name extends string>(
  t1: Flag<T1, T1Name>,
  t2: Flag<T2, T2Name>
): Flag<{ [key in T1Name]: T1 } & { [key in T2Name]: T2 }, T1Name | T2Name> {
  return (args: Args) => {
    const t1v = t1(args);
    const t2v = t2(args);
    return <any>{
      ...t1v,
      ...t2v
    };
  };
}
