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

class Student
{
public:
    string Name;
    int Year;
    double MinGrade;
    string Hash;
    Student() {
        Name = ""; Year = 0; MinGrade = 0.0; Hash = "";
    }
    Student(string name, int year, double minGrade)
    {
        Name = name;
        Year = year;
        MinGrade = minGrade;
    };
    Student(string serialized) {
        int pos = serialized.find(" ");
        string name = serialized.substr(0, pos);
        serialized.erase(0, pos + 1);

        pos = serialized.find(" ");
        int year = stoi(serialized.substr(0, pos).c_str());
        serialized.erase(0, pos + 1);

        int minGrade = stoi(serialized);

        Name = name;
        Year = year;
        MinGrade = minGrade;
    }


    string Serialize() {
        return Name + " " + to_string(Year) + " " + to_string(MinGrade);
    }
};

void WriteData(string filename, list<Student> data)
{
    ofstream myFile(filename);
    list<Student>::iterator it = data.begin();
    myFile << right << setw(15) << setfill(' ') << "Name" << '|';
    myFile << right << setw(15) << setfill(' ') << "Year" << '|';
    myFile << right << setw(15) << setfill(' ') << "Min grade" << '|';
    myFile << right << setw(25) << setfill(' ') << "Hash" << '|';
    myFile << "\n";
    myFile << setw(73) << setfill('-') << ""
        << "\n";
    while (it != data.end())
    {
        myFile << right << setw(15) << setfill(' ') << it->Name << '|';
        myFile << right << setw(15) << setfill(' ') << it->Year << '|';
        myFile << right << setw(15) << setfill(' ') << it->MinGrade << '|';
        myFile << right << setw(25) << setfill(' ') << it->Hash << '|';
        myFile << "\n";
        it++;
    }
    myFile.close();
}

list<Student> ReadData(string filename)
{
    list<Student> data;
    string line;
    ifstream myReadFile(filename);
    while (getline(myReadFile, line))
    {
        int pos = line.find(" ");
        string name = line.substr(0, pos);
        line.erase(0, pos + 1);

        pos = line.find(" ");
        int year = stoi(line.substr(0, pos).c_str());
        line.erase(0, pos + 1);

        int minGrade = stoi(line);
        Student student(name, year, minGrade);
        data.push_front(student);
    }
    return data;
}


int main(int args, char** argvs)
{
    int rank = 0, numOfProcess = 0;
    MPI_Init(&args, &argvs);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &numOfProcess);

    cout << "procesu skaicius: " << numOfProcess << "\n";

    const int workerProcesses = numOfProcess - 3;
    int tagForWorkersForData = 3;
    int tagForWorkersForResults = 4;
    int resultsFinishTag = 5;
    cout << "Rank: " << rank << "\n";

    if (rank == 0) // main process
    {
        list<Student> results;
        list<Student> data = ReadData("./data.txt");
        int dataSize = static_cast<int>(data.size());
        for (int i = 1; i < numOfProcess - 1; i++)
        {
            int index = i;
            MPI_Send(&dataSize, 1, MPI_INT, index, 0, MPI_COMM_WORLD);
        }

    }
    else if (rank <= workerProcesses)
    {
        int c;  MPI_Status s;
        int temp;
        MPI_Probe(0, 0, MPI_COMM_WORLD, &s);
        MPI_Get_count(&s, MPI_INT, &c);
        MPI_Recv(&temp, c, MPI_INT, 0, 0, MPI_COMM_WORLD, &s);
        cout << "DATA size for " << rank << " PROCESS is " << temp << "\n";
    }

    else if (rank == workerProcesses + 1) // data process
    {
        MPI_Status s;
        int c;
        int temp;
        MPI_Probe(0, 0, MPI_COMM_WORLD, &s);
        MPI_Get_count(&s, MPI_INT, &c);
        MPI_Recv(&temp, c, MPI_INT, 0, 0, MPI_COMM_WORLD, &s);
        cout << "DATA size for " << rank << " PROCESS is " << temp << "\n";

    }
    else if (rank == workerProcesses + 2)
    {
    }

    //MPI_Barrier(MPI_COMM_WORLD);
    MPI_Finalize();
    return 0;
}

