import React from "react";

type RenderableComponent<T extends keyof JSX.IntrinsicElements> = (
  props: JSX.IntrinsicElements[T] | null,
  children: (() => void) | (boolean | null | undefined | string | number)
) => void;

enum StackConstants {
  BEGIN_PARENT,
  END_PARENT,
}

type StackItem =
  | {
      name: keyof JSX.IntrinsicElements;
      props: any;
    }
  | StackConstants;

let stack: StackItem[] = [];

export const FrameworkHost: React.FC<{ root: () => void }> = ({ root }) => {
  stack = [];
  root();

  let index = 0;
  let reactNode: React.ReactNode[] = [];

  const buildNodePartial = () => {
    const partialReactNode: React.ReactNode[] = [];

    while (index < stack.length) {
      const stackItem = stack[index];
      const prevStackItem = index === 0 ? null : stack[index - 1];
      index++;

      if (stackItem === StackConstants.BEGIN_PARENT) {
        continue;
      } else if (stackItem === StackConstants.END_PARENT) {
        break;
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

  reactNode = buildNodePartial();
  return React.createElement(React.Fragment, null, reactNode);
};

const renderableComponentFactory = <T extends keyof JSX.IntrinsicElements>(
  tag: T
): RenderableComponent<T> => (props, children) => {
  if (typeof children === "function") {
    stack.push(StackConstants.BEGIN_PARENT);
    stack.push({
      name: tag,
      props,
    });
    children();
    stack.push(StackConstants.END_PARENT);
  } else {
    stack.push({
      name: tag,
      props: {
        ...props,
        children,
      },
    });
  }
};

export const h1 = renderableComponentFactory("h1");
export const div = renderableComponentFactory("div");
export const span = renderableComponentFactory("span");
export const a = renderableComponentFactory("a");
export const button = renderableComponentFactory("button");
export const ol = renderableComponentFactory("ol");
export const li = renderableComponentFactory("li");
