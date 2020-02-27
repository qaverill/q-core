/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import styled from 'styled-components';
import axios from 'axios';
import { red } from '../../../packages/colors';
import { PopupContainer, TextInput, Button } from '../../../packages/core';
import { roundToTwoDecimalPlaces } from '../../../packages/utils';

const Tag = styled.div`
  display: flex;
`;

class ManualTagger extends React.Component {
  componentDidMount() {
    this.tagInput.focus();
  }

  updateDataQUnsaved(updatedTransactions) {
    const { parent } = this.props;
    sessionStorage.setItem('dataQUnsaved', JSON.stringify(updatedTransactions));
    parent.setState({ unsaved: updatedTransactions });
  }

  deductAmountAccordingToOrdinal(targetOrdinal, transaction, idx) {
    const { parent, closeModal } = this.props;
    closeModal();
    if (parent.state.unsaved.find(t => t.ordinal === targetOrdinal)) {
      let oldAmount;
      this.updateDataQUnsaved(parent.state.unsaved.map((t, i) => {
        let updatedTransaction = t;
        if (i === idx) {
          updatedTransaction = null;
        } else if (t.ordinal === targetOrdinal) {
          oldAmount = t.amount;
          updatedTransaction.amount = roundToTwoDecimalPlaces(transaction.amount + t.amount);
        }
        return updatedTransaction;
      }).filter(t => t != null));
      NotificationManager.success(`Updated ordinal ${targetOrdinal} from ${oldAmount} to ${roundToTwoDecimalPlaces(transaction.amount + oldAmount)}`);
    } else {
      axios.get(`/mongodb/transactions?ordinal=${targetOrdinal}`).then(getResponse => {
        const existingTransaction = getResponse.data[0];
        if (existingTransaction) {
          const oldAmount = existingTransaction.amount;
          existingTransaction.amount = roundToTwoDecimalPlaces(existingTransaction.amount + transaction.amount);
          axios.post('/mongodb/transactions', existingTransaction).then(postResponse => {
            if (postResponse.status === 204) {
              parent.state.unsaved[idx] = null;
              NotificationManager.success(`Updated ordinal ${targetOrdinal} (in mongo) from ${oldAmount} to ${existingTransaction.amount}`);
            } else {
              NotificationManager.error('Error when trying to update transaction in mongo', postResponse.statusText);
            }
          });
        } else {
          NotificationManager.error(`Ordinal ${targetOrdinal} does not exist`);
        }
      });
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

export default ManualTagger;
