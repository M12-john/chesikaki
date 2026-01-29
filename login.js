import { supabase } from './supabase-config.js';

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const farmerNumber = document.getElementById('loginFarmerNumber').value;
    const idNumber = document.getElementById('loginIdNumber').value;
    
    try {
        const { data, error } = await supabase
            .from('farmers')
            .select('*')
            .eq('farmer_number', farmerNumber);
        
        if (error) throw error;
        
        if (data.length === 0) {
            alert('❌ Farmer not found!');
            return;
        }
        
        const farmer = data[0];
        if (farmer.id_number !== idNumber) {
            alert('❌ Wrong ID number!');
            return;
        }
        
        const farmerData = {
            fullName: farmer.full_name,
            farmerNumber: farmer.farmer_number,
            idNumber: farmer.id_number,
            phoneNumber: farmer.phone_number,
            id: farmer.id
        };
        
        localStorage.setItem('farmer_' + farmerNumber, JSON.stringify(farmerData));
        localStorage.setItem('currentUser', JSON.stringify(farmerData));
        
        alert('✅ Welcome ' + farmer.full_name + '!');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Login failed!');
    }
});