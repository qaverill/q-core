import React from 'react';
import { red } from 'q-colors';
import styled from 'styled-components';
import { PopupContainer, TextInput, Button } from '../../../../../components/styled-components';

const Tag = styled.div`
  display: flex;
`;

class manualTagger extends React.Component {
  componentDidMount() {
    this.tagInput.focus();
  }

  manuallyTagTransaction(idx, newTag) {
    if (newTag.replace(/ /g, '').length !== 0) {
      const { parent } = this.props;
      const updatedTransactions = parent.state.unsaved.map((transaction, i) => {
        if (i === idx && transaction.tags.indexOf(newTag) < 0) {
          transaction.tags.push(newTag);
        }
        return transaction;
      });
      sessionStorage.setItem('dataQUnsaved', JSON.stringify(updatedTransactions));
      parent.setState({ unsaved: updatedTransactions });
      this.tagInput.value = '';
    }
  }

  removeTag(transactionIdx, tagIdx) {
    console.log(transactionIdx, tagIdx)
    const { parent } = this.props;
    const updatedTransactions = parent.state.unsaved.map((transaction, i) => {
      if (i === transactionIdx) {
        transaction.tags.splice(tagIdx, 1);
      }
      return transaction;
    });
    sessionStorage.setItem('dataQUnsaved', JSON.stringify(updatedTransactions));
    parent.setState({ unsaved: updatedTransactions });
  }

  render() {
    const { transaction, transactionIdx } = this.props;
    return (
      <PopupContainer>
        {transaction.tags.map((tag, tagIdx) => (
          <Tag>
            <h2>{tag}</h2>
            <Button color={red} onClick={() => this.removeTag(transactionIdx, tagIdx)}>X</Button>
          </Tag>
        ))}
        <TextInput
          ref={input => { this.tagInput = input; }}
          onBlur={evt => this.manuallyTagTransaction(transactionIdx, evt.target.value)}
          onKeyDown={evt => evt.keyCode === 13 && this.manuallyTagTransaction(transactionIdx, evt.target.value)}
        />
      </PopupContainer>
    );
  }
}

export default manualTagger;
