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
  Paper,
  Button,
  TextField
} from '@mui/material';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1); // Default quantity for new items

  const updateInventory = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'pantry'));
      const inventoryList = [];
      querySnapshot.forEach((doc) => {
        inventoryList.push({
          id: doc.id, // Document ID as a unique key
          name: doc.data().name || 'Unknown', // Ensure name is displayed
          quantity: doc.data().quantity || 0  // Ensure quantity is displayed
        });
      });
      setPantry(inventoryList);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };

  const removeItem = async (itemId) => {
    const docRef = doc(firestore, 'pantry', itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory();
  };

  const addItem = async (itemId) => {
    const docRef = doc(firestore, 'pantry', itemId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
      await updateInventory(); // Update pantry list after modification
    }
  };

  const handleAddNewItem = async () => {
    if (itemName.trim() === '') return; // Ensure item name is not empty

    const docRef = doc(firestore, 'pantry', itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + quantity }, { merge: true });
    } else {
      await setDoc(docRef, { name: itemName, quantity: quantity });
    }
    setItemName(''); // Clear itemName field
    setQuantity(1); // Reset quantity to default
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Typography variant="h1" gutterBottom>
        Pantry
      </Typography>
      
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <TextField
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          variant="outlined"
          size="small"
          InputProps={{ inputProps: { min: 1 } }}
        />
        <Box display="flex" gap={1}>
          <Button variant="contained" color="primary" onClick={handleAddNewItem}>
            Add Item
          </Button>
        </Box>
      </Box>

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
                  
                  <TableCell align="right">
                    <Button 
                      variant="contained" 
                      onClick={() => removeItem(item.id)}
                    >
                      -
                    </Button>
                    {item.quantity}
                    <Button 
                      variant="contained" 
                      onClick={() => addItem(item.id)}
                    >
                      +
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
