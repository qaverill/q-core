import * as React from 'react';
import styled from 'styled-components';
import { red } from '../../../packages/colors';
import { PopupContainer, TextInput, Button, H2 } from '../../../packages/core';
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// STYLES
// ----------------------------------
const Tag = styled.div`
  display: flex;
`;
// ----------------------------------
// COMPONENTS
// ----------------------------------
const ManualTagger = ({ idx, transaction, closeModal, updateTransaction }) => {
  function updateTransactionTags(newTag) {
    if (newTag.replace(/ /g, '').length !== 0) {
      transaction.tags.push(newTag);
      updateTransaction(transaction, idx)
        .then(closeModal);
    }
  }
  function removeTag(tagIdx) {
    const newTransaction = transaction;
    newTransaction.tags[tagIdx] = null;
    newTransaction.tags = newTransaction.tags.filter(tag => tag != null);
    updateTransaction(newTransaction, idx);
  }
  return (
    <PopupContainer>
      {transaction.tags.map((tag, tagIdx) => (
        <Tag>
          <H2>{tag}</H2>
          <Button color={red} onClick={() => removeTag(tagIdx)}>X</Button>
        </Tag>
      ))}
      <TextInput
        onBlur={evt => updateTransactionTags(evt.target.value)}
        onKeyDown={evt => evt.keyCode === 13 && updateTransactionTags(evt.target.value)}
      />
    </PopupContainer>
  );
};

export default ManualTagger;
