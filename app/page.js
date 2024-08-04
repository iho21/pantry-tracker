'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase'; // Adjust the import based on your file structure
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { collection, deleteDoc, getDocs, setDoc } from 'firebase/firestore';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'pantry'));
      const inventoryList = [];
      querySnapshot.forEach((doc) => {
        inventoryList.push({
          id: doc.id, // Document ID as a unique key
          ...doc.data()
        });
      });
      setPantry(inventoryList);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updatePantry()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
      
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }
    await updatePantry()
  }

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <Box
      width = "100vw"
      height = "100vh"
      display = "flex"
      justifyContent = "center"
      alignItems = "center"
      gap = {2}
    >
      <Typography variant="h1" gutterBottom>
        Pantry
      </Typography>
      {pantry.length === 0 ? (
        <Typography variant="h6">No items in the pantry</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell align="right">Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pantry.map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.name}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
