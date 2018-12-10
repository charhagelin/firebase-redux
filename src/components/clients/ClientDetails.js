import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import classnames from "classnames";

class ClientDetails extends Component {
  state = {
    showBalanceUpdate: false,
    balanceUpdateAmount: ""
  };

  toggleBalance = () => {
    this.setState({ showBalanceUpdate: !this.state.showBalanceUpdate });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  balanceSubmit = e => {
    e.preventDefault();

    const { client, firestore } = this.props;
    const { balanceUpdateAmount } = this.state;

    const clientUpdate = {
      balance: parseFloat(balanceUpdateAmount)
    };

    firestore.update({ collection: "clients", doc: client.id }, clientUpdate);

    console.log(this.state.balanceUpdateAmount);
  };

  onDelete = () => {
    const { client, firestore, history } = this.props;

    firestore
      .delete({ collection: "clients", doc: client.id })
      .then(history.push("/"));
  };

  render() {
    const { client } = this.props;
    const { showBalanceUpdate, balanceUpdateAmount } = this.state;

    let balanceForm = "";
    // if balance form should display
    if (showBalanceUpdate) {
      balanceForm = (
        <form onSubmit={this.balanceSubmit}>
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              name="balanceUpdateAmount"
              placeholder="Add New Balance"
              value={balanceUpdateAmount}
              onChange={this.onChange}
            />
            <div className="input-group-append">
              <input
                type="submit"
                value="Update"
                className="btn btn-outline-dark"
              />
            </div>
          </div>
        </form>
      );
    } else {
      balanceForm = null;
    }

    if (client) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/">
                <i className="fas fa-arrow-circle-left" />
                Back to Dashboard
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="btn btn-group float-right" />
            <Link to={`/client/edit/${client.id}`} className="btn btn-dark">
              Edit
            </Link>
            <button onClick={this.onDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
          <hr />
          <div className="card-header">
            <h3>
              {client.firstName} {client.lastName}
            </h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-8 col-sm-6">
                <h4>
                  {" "}
                  Client id: <span className="text-secondary">{client.id}</span>
                </h4>
              </div>
              <div className="col-md-4 col-sm-6">
                <h3 className="pull-right">
                  Balance:{" "}
                  <span
                    className={classnames({
                      "text-danger": client.balance > 0,
                      "text-success": client.balance <= 0
                    })}
                  >
                    {" "}
                    ${parseFloat(client.balance).toFixed(2)}
                  </span>
                  <a href="#" onClick={this.toggleBalance}>
                    <i className="fas fa-pencil-alt" />
                  </a>
                </h3>
                {balanceForm}
                <hr />
                <ul className="list-group">
                  <li className="list-group-item">
                    <i className="fas fa-envelope" />
                    Contact Email: {client.email}
                  </li>
                  <li className="list-group-item">
                    <i className="fas fa-phone" /> Contact Phone: {client.phone}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

export default compose(
  firestoreConnect(props => [
    { collection: "clients", storeAs: "client", doc: props.match.params.id }
  ]),
  connect(({ firestore: { ordered } }, props) => ({
    client: ordered.client && ordered.client[0]
  }))
)(ClientDetails);
