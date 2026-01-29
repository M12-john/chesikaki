import { supabase } from './supabase-config.js';

const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const farmerNumber = document.getElementById('farmerNumber').value;
    const idNumber = document.getElementById('idNumber').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    try {
        const { data, error } = await supabase
            .from('farmers')
            .insert([{
                full_name: fullName,
                farmer_number: farmerNumber,
                id_number: idNumber,
                phone_number: phoneNumber
            }])
            .select();
        
        if (error) throw error;
        
        const farmer = {
            fullName: fullName,
            farmerNumber: farmerNumber,
            idNumber: idNumber,
            phoneNumber: phoneNumber,
            id: data[0].id
        };
        
        localStorage.setItem('farmer_' + farmerNumber, JSON.stringify(farmer));
        localStorage.setItem('currentFarmer', JSON.stringify(farmer));
        
        alert('🎉 Account created for ' + fullName + '!');
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + error.message);
    }
    
    signupForm.reset();
});