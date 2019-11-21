/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import React from 'react';
import styled from 'styled-components';
import { red } from '@q/theme';
import { PopupContainer, TextInput, Button } from '@q/core';
import { roundToTwoDecimalPlaces } from '@q/utils';
import { NotificationManager } from 'react-notifications';

const Tag = styled.div`
  display: flex;
`;

class manualTagger extends React.Component {
  componentDidMount() {
    this.tagInput.focus();
  }

  updateDataQUnsaved(updatedTransactions) {
    const { parent } = this.props;
    sessionStorage.setItem('dataQUnsaved', JSON.stringify(updatedTransactions));
    parent.setState({ unsaved: updatedTransactions });
  }

  deductAmountAccordingToOrdinal(targetOrdinal, transaction, idx) {
    const { parent, closeModal, ordinalStart } = this.props;
    if (parent.state.unsaved.map(t => t.ordinal).indexOf(targetOrdinal) > 0) {
      this.updateDataQUnsaved(parent.state.unsaved
        .map((t, i) => {
          let updatedTransaction = t;
          if (i === idx) {
            updatedTransaction = null;
          } else if (t.ordinal === targetOrdinal) {
            updatedTransaction.amount = roundToTwoDecimalPlaces(transaction.amount + t.amount);
          }
          return updatedTransaction;
        })
        .filter(t => t != null)
        .reverse()
        .map((item, n) => ({ ...item, ordinal: ordinalStart + n }))
        .reverse());
      closeModal();
    } else {
      NotificationManager.error(`Ordinal ${targetOrdinal} does not exist`);
    }
  }

  manuallyTagTransaction(transaction, idx, newTag) {
    if (newTag.replace(/ /g, '').length !== 0) {
      const { parent, closeModal } = this.props;
      if (!isNaN(newTag)) {
        const targetOrdinal = parseInt(newTag, 10);
        this.deductAmountAccordingToOrdinal(targetOrdinal, transaction, idx);
      } else {
        this.updateDataQUnsaved(parent.state.unsaved.map((t, i) => {
          if (i === idx && t.tags.indexOf(newTag) < 0) {
            t.tags.push(newTag);
          }
          return t;
        }));
        closeModal();
      }
    }
  }

  removeTag(transactionIdx, tagIdx) {
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
          onBlur={evt => this.manuallyTagTransaction(transaction, transactionIdx, evt.target.value)}
          onKeyDown={evt => evt.keyCode === 13 && this.manuallyTagTransaction(transaction, transactionIdx, evt.target.value)}
        />
      </PopupContainer>
    );
  }
}

export default manualTagger;
