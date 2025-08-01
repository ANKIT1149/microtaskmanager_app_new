import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Avatar, Button, Card } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';
import { GetUserServices } from '@/services/GetUserServices';
import { GetQoutaServices } from '@/services/GetQoutaServices';
import { getClientServices } from '@/services/GetClientServices';
import { ProjectServices } from '@/services/ProjectsServices';
import { FetchtaskSize, GetTaskProgressServices } from '@/services/TaskServices';
import { UserData } from '@/Interface/UserInfoProps';
import { Task } from '@/Interface/TaskProps';
import { QoutaData } from '@/Interface/QoutaProps';
import { InvoiceCountAndEarningServices } from '@/services/InvoiceCountAndEarningServices';
import { LogOutServices } from '@/services/LogOutServices';
import { DeleteAccountServices } from '@/services/DeleteAccountServices';
import { getClientCountServices } from '@/services/GetClientsCountServices';

export default function DashboardScreen() {
  const [userData, setUserData] = useState<UserData>({ username: 'User', email: '' });
  const [quotas, setQuotas] = useState<QoutaData>({ ai_count: 0, email_count: 0, isSubscribed: false });
  const [clientCount, setClientCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, quotas, clients, projects, completedTasks, tasks, invoices] = await Promise.all([
          GetUserServices(),
          GetQoutaServices(),
          getClientCountServices(),
          ProjectServices(),
          FetchtaskSize(),
          GetTaskProgressServices(),
          InvoiceCountAndEarningServices(),
        ]);

        setUserData(user);
        setQuotas(quotas);
        setClientCount(clients);
        setProjectCount(projects);
        setCompletedTaskCount(completedTasks);
        setActiveTasks(tasks);
        setInvoiceCount(invoices.count);
        setTotalEarnings(invoices.earnings);
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load dashboard: ' + (error.message || 'Unknown error'),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await LogOutServices();
      router.replace('/login');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to logout: ' + (error.message || 'Unknown error'),
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await DeleteAccountServices();
      router.replace('/login');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account deleted successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete account: ' + (error.message || 'Unknown error'),
      });
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-[#1a1f3a] justify-center items-center`}>
        <ActivityIndicator size="large" color="#00ffcc" />
      </View>
    );
  }

  return (
    <ScrollView style={tw`flex-1 bg-[#1a1f3a] p-4`}>
    
      <TouchableOpacity style={tw`absolute top-4 right-4`} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={24} color="#00ffcc" />
      </TouchableOpacity>

      <View style={tw`items-center mb-4 mt-10`}>
        <Avatar.Text
          size={80}
          label={userData.username[0]?.toUpperCase() || 'U'}
          style={tw`bg-[#0a0f2a] text-[#00ffcc]`}
        />
        <Text style={tw`text-lg font-bold text-[#00ffcc] mt-2 capitalize`}>{userData.email}</Text>
        <Text style={tw`text-sm text-gray-300`}>{quotas.isSubscribed ? 'Paid' : 'Free'} Plan</Text>
      </View>

      <Card style={tw`bg-[#0a0f2a] mb-4 mt-5 rounded-lg`}>
        <Card.Content>
          <Text style={tw`text-lg font-semibold font-serif mb-3 text-[#00ffcc]`}>This Months Usage:-</Text>
          <Text style={tw`text-lg text-gray-100 font-serif italic mb-2`}>
            AI Invoices: {quotas.ai_count}/{quotas.isSubscribed ? 'Unlimited' : '2'}
          </Text>
          <Text style={tw`text-lg text-gray-100 font-serif italic mb-2`}>
            Emails Sent: {quotas.email_count}/{quotas.isSubscribed ? 'Unlimited' : '5'}
          </Text>
        </Card.Content>
      </Card>


      {!quotas.isSubscribed && (
        <View style={tw`items-end mb-4`}>
          <Button
            mode="contained"
            buttonColor="#00ffcc"
            textColor="#1a1f3a"
            style={tw`w-1/2 rounded-lg font-serif`}
          >
            Upgrade Plan
          </Button>
        </View>
      )}

      {/* Clients and Projects Boxes */}
      <View style={tw`flex-row justify-between mb-4 mt-5`}>
        <Card style={tw`bg-[#0a0f2a] w-[48%] rounded-lg`}>
          <Card.Content>
            <Text style={tw`text-lg font-semibold text-[#00ffcc]`}>Total Clients</Text>
            <Text style={tw`text-2xl text-gray-300 mt-2`}>{clientCount}</Text>
          </Card.Content>
        </Card>
        <Card style={tw`bg-[#0a0f2a] w-[48%] rounded-lg`}>
          <Card.Content>
            <Text style={tw`text-lg font-semibold text-[#00ffcc]`}>Total Projects</Text>
            <Text style={tw`text-2xl text-gray-300 mt-2`}>{projectCount}</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Tasks and Invoices Boxes */}
      <View style={tw`flex-row justify-between mb-4`}>
        <Card style={tw`bg-[#0a0f2a] w-[48%] rounded-lg`}>
          <Card.Content>
            <Text style={tw`text-lg font-semibold text-[#00ffcc]`}>Completed Tasks</Text>
            <Text style={tw`text-2xl text-gray-300 mt-2`}>{completedTaskCount}</Text>
          </Card.Content>
        </Card>
        <Card style={tw`bg-[#0a0f2a] w-[48%] rounded-lg`}>
          <Card.Content>
            <Text style={tw`text-lg font-semibold text-[#00ffcc]`}>Total Invoices</Text>
            <Text style={tw`text-2xl text-gray-300 mt-2`}>{invoiceCount}</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Active Tasks */}
      <Card style={tw`bg-[#0a0f2a] mb-4 rounded-lg`}>
        <Card.Content>
          <Text style={tw`text-lg font-semibold text-[#00ffcc] mb-2`}>Active Tasks</Text>
          {activeTasks.length === 0 ? (
            <Text style={tw`text-sm text-gray-300`}>No active tasks</Text>
          ) : (
            activeTasks.map((task) => (
              <View key={task.id} style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-sm text-gray-300 w-2/3`}>{task.name}</Text>
                <Button
                  mode="outlined"
                  textColor="#00ffcc"
                  style={tw`border-[#00ffcc]`}
                  onPress={() => router.push(`/task`)}
                >
                  Check Task
                </Button>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Total Earnings */}
      <Card style={tw`bg-[#0a0f2a] mb-4 rounded-lg`}>
        <Card.Content>
          <Text style={tw`text-lg font-semibold text-[#00ffcc]`}>Total Earnings</Text>
          <Text style={tw`text-2xl text-gray-300`}>${totalEarnings.toFixed(2)}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        buttonColor=""
        textColor="#ffffff"
        style={tw`mb-4 py-2`}
        onPress={handleDeleteAccount}
      >
        Manage Clients
      </Button>
      <Button
        mode="contained"
        buttonColor="#ff4d4d"
        textColor="#ffffff"
        style={tw`mb-8 mt-3 py-2`}
        onPress={handleDeleteAccount}
      >
        Delete Account
      </Button>
      {/* Delete Account */}
    </ScrollView>
  );
}
