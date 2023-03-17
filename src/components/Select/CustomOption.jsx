import { components } from 'react-select';
import styles from './Select.module.scss'

const CustomOption = ({ children, ...props }) => {
  // eslint-disable-next-line no-unused-vars
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
  const newProps = { ...props, innerProps: rest };
  return (
    <components.Option 
      {...newProps}
      className={styles["custom-option"]}
    >
      {children}
    </components.Option>
  );
};

export default CustomOption