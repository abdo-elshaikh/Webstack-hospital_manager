import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider } from '@mui/material';

const Invoice = ({ appointments, patient }) => {
  const handlePrint = () => {
    const title = `Invoice - ${patient?.name}`;
    window.print();
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" color={'primary.main'} gutterBottom>
        HMS | Invoice 
      </Typography>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="body1">
          <strong>Invoice No:</strong> {patient?._id}
        </Typography>
        <Typography variant="body1">
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          <strong>Customer Name:</strong> {patient?.name}
        </Typography>
      </Box>

      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell align="right">Department</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments?.map((appointment, index) => (
              <TableRow key={index}>
                <TableCell>{appointment.service?.service}</TableCell>
                <TableCell align="right">{appointment.department?.name}</TableCell>
                <TableCell align="right">{new Date(appointment?.date).toLocaleDateString()}</TableCell>
                <TableCell align="right">${appointment.price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box component={Paper} sx={{ marginTop: 2, p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="body1">
          <strong>SubTotal:</strong> ${appointments?.reduce((total, appointment) => total + appointment.price, 0).toFixed(2)}
        </Typography>
        <Typography variant="body1">
          <strong>Discount:</strong> ${appointments?.reduce((discount, appointment) => discount + appointment.discount, 0).toFixed(2)}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }} color={'red'}>
          <strong>Total:</strong> ${appointments?.reduce((total, appointment) => total + appointment.total, 0).toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body1">
          <strong>Payment Method:</strong> Cash
        </Typography>
      </Box>
      {/* management signature */}
      <Box display={'flex'} sx={{ marginTop: 2, marginBottom: 2 }}  >
        <Typography variant="body1">
          <strong>Management Signature:</strong>
        </Typography>

        <Typography variant="body1" sx={{ marginLeft: 'auto' }}>
          <strong>Date:</strong> {new Date().toLocaleDateString()}
        </Typography>

      </Box>

      <Divider sx={{ marginTop: 2 }} />

      <Button onClick={handlePrint} variant="contained" sx={{ marginTop: 3 }}>
        Print Invoice
      </Button>
    </Box>
  );
};

export default Invoice;
