import { useRef } from 'react';
import { FormProps } from '../types/interfaces';
import useInputError from '../utils/hooks/useInputError';

import FlatBtn from './FlatBtn';
import InputField from './InputField';
import Select from './Select';

import styles from '../styles/Form.module.scss';
import RadioList from './RadioList';

export default function Form({
  fields,
  inputValues,
  actionBtnText,
  noCancelBtn,
  cancelBtnText,
  handleChange,
  submitAction,
  cleanUp,
  close,
  setError,
}: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const fieldNames = fields.map((f) => f.name);
  const { inputError, validateInput, submitForm } = useInputError(fieldNames);

  return (
    <form
      ref={formRef}
      autoComplete="nope"
      onSubmit={async (e) => {
        cleanUp = cleanUp || close;
        await submitForm(e, submitAction, cleanUp, setError);
      }}
      className={styles.main}
    >
      <div className="content">
        <input type="password" hidden />
        {/* need this to turn off autocomplete */}
        {fields.map((f, idx) => {
          switch (f.type) {
            case 'dropdown':
              return <Select {...f} />;
            case 'radioList':
              return <RadioList {...f} />;
            default:
              return (
                <InputField
                  key={idx}
                  autoFocus={idx === 0}
                  onBlur={(e: React.FormEvent<HTMLInputElement>) =>
                    validateInput(e.currentTarget)
                  }
                  error={inputError[f.name]}
                  onChange={handleChange}
                  value={inputValues[f.name] || ''}
                  {...f}
                />
              );
          }
        })}
      </div>
      <footer>
        <div className={styles['btn-ctn']}>
          {!noCancelBtn && (
            <FlatBtn
              text={cancelBtnText || 'Cancel'}
              underline={true}
              onClick={close}
              size="small"
            />
          )}
          <FlatBtn
            type="submit"
            text={actionBtnText || 'Done'}
            filled={true}
            size="small"
          />
        </div>
      </footer>
    </form>
  );
}
