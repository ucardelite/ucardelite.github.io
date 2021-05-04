// ConsoleApplication1.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <mpi.h>
#include <fstream>
#include <list>
#include <string>
#include <iomanip>
#include <filesystem>
namespace fs = std::filesystem;
using namespace std;

//class Student
//{
//public:
//    string Name;
//    int Year;
//    double MinGrade;
//    string Hash;
//    Student(){
//        Name = ""; Year = 0; MinGrade = 0.0; Hash = "";
//    }
//    Student(string name, int year, double minGrade)
//    {
//        Name = name;
//        Year = year;
//        MinGrade = minGrade;
//    };
//    Student(string serialized) {
//        int pos = serialized.find(" ");
//        string name = serialized.substr(0, pos);
//        serialized.erase(0, pos + 1);
//
//        pos = serialized.find(" ");
//        int year = stoi(serialized.substr(0, pos).c_str());
//        serialized.erase(0, pos + 1);
//
//        int minGrade = stoi(serialized);
//
//        Name = name;
//        Year = year;
//        MinGrade = minGrade;
//    }
//
//
//    string Serialize() {
//        return Name + " " + to_string(Year) + " " + to_string(MinGrade);
//    }
//};
//
//void WriteData(string filename, list<Student> data)
//{
//    ofstream myFile(filename);
//    list<Student>::iterator it = data.begin();
//    myFile << right << setw(15) << setfill(' ') << "Name" << '|';
//    myFile << right << setw(15) << setfill(' ') << "Year" << '|';
//    myFile << right << setw(15) << setfill(' ') << "Min grade" << '|';
//    myFile << right << setw(25) << setfill(' ') << "Hash" << '|';
//    myFile << "\n";
//    myFile << setw(73) << setfill('-') << ""
//        << "\n";
//    while (it != data.end())
//    {
//        myFile << right << setw(15) << setfill(' ') << it->Name << '|';
//        myFile << right << setw(15) << setfill(' ') << it->Year << '|';
//        myFile << right << setw(15) << setfill(' ') << it->MinGrade << '|';
//        myFile << right << setw(25) << setfill(' ') << it->Hash << '|';
//        myFile << "\n";
//        it++;
//    }
//    myFile.close();
//}
//
//list<Student> ReadData(string filename)
//{
//    list<Student> data;
//    string line;
//    ifstream myReadFile(filename);
//    while (getline(myReadFile, line))
//    {
//        int pos = line.find(" ");
//        string name = line.substr(0, pos);
//        line.erase(0, pos + 1);
//
//        pos = line.find(" ");
//        int year = stoi(line.substr(0, pos).c_str());
//        line.erase(0, pos + 1);
//
//        int minGrade = stoi(line);
//        Student student(name, year, minGrade);
//        data.push_front(student);
//    }
//    return data;
//}


int main(int args, char ** argvs)
{
    int rank = 0, numOfProcess = 0;
    MPI_Init(&args, &argvs);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &numOfProcess);
    
    int tagForSenders = 1;
    int tagForPrinters = 2;

    if (rank == 0) // gavejas process
    {
        int finishedProcesses = 0; // 2 sender processes have to be finished
        int receivedNumbers = 0;
        while (finishedProcesses < 2)
        {
            MPI_Status status;
            int count;
            int number;
            MPI_Probe(MPI_ANY_SOURCE, tagForSenders, MPI_COMM_WORLD, &status);
            MPI_Get_count(&status, MPI_INT, &count);
            MPI_Recv(&number, count, MPI_INT, MPI_ANY_SOURCE, tagForSenders, MPI_COMM_WORLD, &status);
            
            receivedNumbers++;

            if (receivedNumbers >= 20)
            {
                finishedProcesses++;
            }

            int response = receivedNumbers >= 20 ? 0 : 1;
            MPI_Send(&response, 1, MPI_INT, status.MPI_SOURCE, tagForSenders, MPI_COMM_WORLD);

            if (receivedNumbers <= 20)
            {
                int dest = number % 2 == 0 ? 3 : 4;
                MPI_Send(&number, 1, MPI_INT, dest, tagForPrinters, MPI_COMM_WORLD);
            }
            
          
            
        }
        int endNumber = 40; // process that sends numbers from 11, can send 31 max
        MPI_Send(&endNumber, 1, MPI_INT, 3, tagForPrinters, MPI_COMM_WORLD);
        MPI_Send(&endNumber, 1, MPI_INT, 4, tagForPrinters, MPI_COMM_WORLD);
    }

    else if (rank == 1 || rank == 2) // sender processes
    {
        bool finished = false;
        int number = rank == 1 ? 0 : 11;
        while (!finished)
        {
            cout << "number to send: " << number << "\n";
            MPI_Send(&number, 1, MPI_INT, 0, tagForSenders, MPI_COMM_WORLD);
            MPI_Status status;
            int count;
            int response;
            MPI_Probe(0, tagForSenders, MPI_COMM_WORLD, &status);
            MPI_Get_count(&status, MPI_INT, &count);
            MPI_Recv(&response, count, MPI_INT, 0, tagForSenders, MPI_COMM_WORLD, &status);
            if (response == 0)
            {
                finished = true;
            }
            else
            {
                number++;
            }
        }
    }
    else if (rank == 3 || rank == 4)
    { 
        int numbers[20] = {};
        int currIndex = 0;
        bool finished = false;
        while (!finished)
        {
            MPI_Status status;
            int count;
            int number;
            MPI_Probe(0, tagForPrinters, MPI_COMM_WORLD, &status);
            MPI_Get_count(&status, MPI_INT, &count);
            MPI_Recv(&number, count, MPI_INT, 0, tagForPrinters, MPI_COMM_WORLD, &status);
            if (number == 40)
            {
                finished = true;
            }
            else
            {
                numbers[currIndex] = number;
                currIndex++;
            }
        }
        for (int i = 0; i < currIndex; i++)
        {
            cout << numbers[i] << "\n";
        }
    }

    MPI_Barrier(MPI_COMM_WORLD);

    MPI_Finalize();
    return 0;
}

