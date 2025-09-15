type WithoutGenericComponentProps<T> = Omit<T, 'view' | 'logic'>;

/**
 * The properties of the GenericComponent.
 * @template T - The type of the properties of the view component.
 * @template Y - The type of the properties of the logic function.
 */
type GenericComponentProps<T, Y> = {
  /**
   * The logic function that will be used to generate the properties of the view component.
   */
  logic: (args: WithoutGenericComponentProps<Y>) => T;
  /**
   * The view component that will be rendered.
   */
  view: React.FC<WithoutGenericComponentProps<T>>;
} & WithoutGenericComponentProps<Y>;

/**
 * GenericComponent is a higher order component that takes a logic
 * function and a view component and returns a new component.
 * @param {Object} props - The properties of the component.
 * @template T - The type of the properties of the view component.
 * @template Y - The type of the properties of the logic function.
 * @returns {JSX.Element} The generated component
 */
export function GenericComponent<T, Y = undefined>({
  logic: useLogic,
  view: Component,
  ...rest
}: GenericComponentProps<T, Y>) {
  const props = useLogic(rest as WithoutGenericComponentProps<Y>);
  const componentProps = {
    ...rest,
    ...props,
  };
  return <Component {...componentProps} />;
}
