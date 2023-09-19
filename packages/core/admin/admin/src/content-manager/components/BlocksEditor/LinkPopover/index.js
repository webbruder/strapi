import * as React from 'react';

import {
  Popover,
  Typography,
  BaseLink,
  IconButton,
  Field,
  FieldLabel,
  FieldInput,
  Flex,
  Button,
} from '@strapi/design-system';
import { Trash, Pencil } from '@strapi/icons';
import PropTypes from 'prop-types';

const LinkPopover = ({ show, source, isEditing, text, url, onDismiss, onSave }) => {
  if (!show) {
    return null;
  }

  const handleOnSave = ({ target }) => {
    const { text, url } = target.elements;

    onSave({ text: text.value, url: url.value });
  };

  return (
    <Popover source={source} centered onDismiss={onDismiss} padding={4}>
      {isEditing ? (
        <Flex direction="column" gap={4}>
          <form onSubmit={handleOnSave}>
            <Field width="300px">
              <FieldLabel>Text</FieldLabel>
              <FieldInput name="text" placeholder="This text is the text of the link" />
            </Field>
            <Field width="300px">
              <FieldLabel>Link</FieldLabel>
              <FieldInput name="url" placeholder="https://strapi.io" />
            </Field>
            <Flex justifyContent="end" width="100%" gap={2}>
              <Button variant="tertiary" onClick={onDismiss}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </Flex>
          </form>
        </Flex>
      ) : (
        <Flex>
          <Typography>{text}</Typography>
          <BaseLink href={url}>{url}</BaseLink>
          <Flex>
            <IconButton icon={<Trash />} />
            <IconButton icon={<Pencil />} />
          </Flex>
        </Flex>
      )}
    </Popover>
  );
};

LinkPopover.defaultProps = {
  source: null,
  isEditing: false,
  text: '',
  url: '',
};

LinkPopover.propTypes = {
  show: PropTypes.bool.isRequired,
  source: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  isEditing: PropTypes.bool,
  text: PropTypes.string,
  url: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export { LinkPopover };
