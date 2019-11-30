import React, { useCallback, useContext } from 'react';
import { Modal, Button, Header, Form, InputOnChangeData, TextAreaProps, Message } from 'semantic-ui-react';
import { useLocalStore, observer, useAsObservableSource, Observer } from 'mobx-react-lite';
import { ServicesContext } from '../../../services/context';
import { createStore, StoreContext } from './store';

interface AddCommentButtonProps {
  postId: number
}

export const AddCommentButton: React.FC<AddCommentButtonProps> = ({ postId }) => {
  const api = useContext(ServicesContext)!;
  const source = useAsObservableSource({ postId, api });
  const localStore = useLocalStore(createStore, source);
  return <Observer>{() => (
    <StoreContext.Provider value={localStore}>
      <Modal
        closeIcon
        open={localStore.openStatus}
        onClose={localStore.toggleOpen}
        trigger={
          <Button
            primary
            content='Add Comment'
            labelPosition='left'
            icon='edit'
            onClick={localStore.toggleOpen}
          />
        }>

        <Header icon='archive' content='Add a comment for this post' />

        <Modal.Content>
          <TheForm />
          <TheMessage />
        </Modal.Content>

        <Modal.Actions>
          <TheButtons />
        </Modal.Actions>

      </Modal >
    </StoreContext.Provider >
  )}
  </Observer>
};

const TheForm: React.FC = () => {
  const localStore = useContext(StoreContext)!;
  const onChange = useCallback((_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, data: InputOnChangeData | TextAreaProps) => {
    if (data.value !== undefined && typeof data.value !== "string") {
      throw new Error(`Unexpected field data type: ${data.type}`)
    }
    localStore.updateField(data.name, data.value);
  }, [localStore]);
  return <>
    <Observer>{() =>
      <Form loading={localStore.saveStatus === 'saving'}>
        <Observer>{() =>
          <Form.Input
            name='title'
            label="Title"
            placeholder='Title'
            required
            disabled={!localStore.canEdit}
            onChange={onChange}
            value={localStore.fields.title}
          />
        }</Observer>
        <Observer>{() =>
          <Form.TextArea
            name='comment'
            label="Comment"
            placeholder='Tell us more'
            rows={5}
            onChange={onChange}
            value={localStore.fields.comment}
            required
            disabled={!localStore.canEdit}
          />
        }</Observer>
        <Observer>{() =>
          <Form.Input
            name='email'
            label="Email"
            type='email'
            placeholder='Who are you ?'
            onChange={onChange}
            value={localStore.fields.email}
            disabled={!localStore.canEdit}
          />}</Observer>
      </Form>
    }</Observer>
  </>
};

const TheMessage: React.FC = observer(() => {
  const localStore = useContext(StoreContext)!;

  return (
    <Message
      warning={localStore.saveStatus === "toSave"}
      success={localStore.saveStatus === "successfull"}
      error={localStore.saveStatus === "failure"}
    >
      {localStore.getMessage()}
    </Message>
  );
});

const TheButtons: React.FC = observer(() => {
  const localStore = useContext(StoreContext)!;
  return (
    <>
      <Button
        content="Save"
        icon="checkmark"
        color='green'
        disabled={!localStore.canSave()}
        onClick={localStore.save}
      />
      <Button
        content={localStore.canEdit() ? 'Cancel' : 'Close'}
        icon="remove"
        color='red'
        disabled={localStore.saveStatus === 'saving'}
        onClick={localStore.toggleOpen}
      />
    </>
  );
});
