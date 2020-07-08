import React from "react";

type TagChildren =
  | (() => void)
  | (boolean | null | undefined | string | number);

enum HookConstants {
  USE_STATE,
}

enum StackConstants {
  BEGIN_PARENT,
  END_PARENT,
}

type StackItem =
  | {
      name: keyof JSX.IntrinsicElements;
      props: any;
    }
  | StackConstants
  | [HookConstants.USE_STATE, [any, (newValue: any) => void]];

let stack: StackItem[] = [];

export const Framework: React.FC<{ root: () => void }> = ({ root }) => {
  stack = [];
  root();

  let index = 0;

  const buildNodePartial = (): React.ReactNode[] => {
    const partialReactNode: React.ReactNode[] = [];

    while (index < stack.length) {
      const stackItem = stack[index];
      const prevStackItem = index === 0 ? null : stack[index - 1];
      index++;

      if (stackItem === StackConstants.BEGIN_PARENT) {
        continue;
      } else if (stackItem === StackConstants.END_PARENT) {
        break;
      } else if (Array.isArray(stackItem)) {
        if (stackItem[0] === HookConstants.USE_STATE) {
          // ...
        }
      } else {
        const props = {
          key: index,
          ...stackItem.props,
        };
        if (prevStackItem === StackConstants.BEGIN_PARENT) {
          partialReactNode.push(
            React.createElement(stackItem.name, props, buildNodePartial())
          );
        } else {
          partialReactNode.push(React.createElement(stackItem.name, props));
        }
      }
    }

    return partialReactNode;
  };

  return React.createElement(React.Fragment, null, buildNodePartial());
};

export const useState = <T>(value: T): [T, (newValue: T) => void] => {
  const tuple: [T, (newValue: T) => void] = [value, () => {}];
  stack.push([HookConstants.USE_STATE, tuple]);
  return tuple;
};

const tagFactory = <T extends keyof JSX.IntrinsicElements>(tagName: T) => {
  function tag<T extends keyof JSX.IntrinsicElements>(
    props: JSX.IntrinsicElements[T] | null,
    children: TagChildren
  ): void;
  function tag<T extends keyof JSX.IntrinsicElements>(
    children: TagChildren,
    secondParameter?: undefined
  ): void;
  function tag(
    propsOrChildren: JSX.IntrinsicElements[T] | TagChildren | null,
    childrenOrUndefined?: TagChildren
  ) {
    let children: TagChildren;
    let props: JSX.IntrinsicElements[T] | null;

    if (
      typeof propsOrChildren === "string" ||
      typeof propsOrChildren === "number" ||
      typeof propsOrChildren === "boolean" ||
      typeof propsOrChildren === "function" ||
      propsOrChildren === undefined
    ) {
      props = null;
      children = propsOrChildren;
    } else {
      props = propsOrChildren;
      children = childrenOrUndefined;
    }

    if (typeof children === "function") {
      stack.push(StackConstants.BEGIN_PARENT);
      stack.push({
        name: tagName,
        props,
      });
      children();
      stack.push(StackConstants.END_PARENT);
    } else {
      stack.push({
        name: tagName,
        props: {
          ...props,
          children,
        },
      });
    }
  }

  return tag;
};
export const h1 = tagFactory("h1");
export const div = tagFactory("div");
export const span = tagFactory("span");
export const a = tagFactory("a");
export const button = tagFactory("button");
export const ol = tagFactory("ol");
export const li = tagFactory("li");
