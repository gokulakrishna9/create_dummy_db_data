let { queryR }= require('./db_op');

function getTransactionStatus(transactionRec, clb) {
  sql = 'SELECT * FROM lt_state WHERE code_writer_v2.lt_id = ' + transactionRec.lt_id + ' AND lt_req_key = "' + transactionRec.lt_req_key + '"';
  queryR(sql, (err, rslt) => {
    clb(err, rslt);
  });
}

function writeTransactionState(record, clbck) {
  let sql = "INSERT INTO code_writer_v2.lt_state (lt_req_key) VALUES ('" + record + "')";
  queryR(sql, (err, rslt) => { clbck(err, { lt_req_key: record, ...rslt }); });
}

function updateTransactionState(filter, record, clbck) {
  console.log(filter);
  let sql = "UPDATE code_writer_v2.lt_state SET status = " + record + " WHERE lt_id = " + filter.t_state + " AND lt_req_key = '" + filter.lt_req_key + "'";
  queryR(sql, (err, rslt) => { clbck(err, { lt_req_key: record, ...rslt, lt_state: record }); });
}

exports.updateTransactionState = updateTransactionState;
exports.writeTransactionState = writeTransactionState;
exports.getTransactionStatus = getTransactionStatus;