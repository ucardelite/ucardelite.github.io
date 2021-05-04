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
        Name = ""; Year = 0; MinGrade = 0.0; Hash = "empty";
    }
    Student(string name, int year, double minGrade)
    {
        Name = name;
        Year = year;
        MinGrade = minGrade;
        Hash = "empty";
    };
    Student(string serialized) {
        int pos = serialized.find(" ");
        string name = serialized.substr(0, pos);
        serialized.erase(0, pos + 1);

        pos = serialized.find(" ");
        int year = stoi(serialized.substr(0, pos).c_str());
        serialized.erase(0, pos + 1);

        pos = serialized.find(" ");
        int minGrade = stoi(serialized.substr(0, pos).c_str());
        serialized.erase(0, pos + 1);

        Hash = serialized == "" ? "empty" : serialized;
        Name = name;
        Year = year;
        MinGrade = minGrade;
    }


    string Serialize() {
        return Name + " " + to_string(Year) + " " + to_string(MinGrade) + " " + Hash;
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

    string filename = "./data.txt";
    const int workerProcesses = numOfProcess - 3;
    int tagForWorkersForData = 3;
    int tagForWorkersForResults = 4;
    int resultsFinishTag = 5;

    if (rank == 0) // main process
    {
        list<Student> results;
        list<Student> data = ReadData(filename);

        int dataSize = static_cast<int>(data.size());
        for (int i = 1; i < numOfProcess - 1; i++)
        {
            int index = i;
            MPI_Send(&dataSize, 1, MPI_INT, index, 0, MPI_COMM_WORLD);
        }

        list<Student> ::iterator it = data.begin();
        while (it != data.end())
        {
            string student = it->Serialize();
            const char* buffer = student.c_str();
            MPI_Send(buffer, static_cast<int>(student.size()), MPI_CHAR, workerProcesses + 1, 0, MPI_COMM_WORLD);
            it++;
        }


        bool finished = false;
        while (!finished) {
            char buf[100] = "";
            MPI_Status status;
            int count;
            MPI_Probe(workerProcesses + 2, 0, MPI_COMM_WORLD, &status);
            MPI_Get_count(&status, MPI_CHAR, &count);
            MPI_Recv(buf, count, MPI_CHAR, workerProcesses + 2, 0, MPI_COMM_WORLD, &status);
            string str(buf);
            if (str.substr(0, 3) == "bye")
            {
                finished = true;
            }
            else
            {
                Student student(str);
                list<Student>::iterator it = results.begin();
                bool inserted = false;
                while (it != results.end() && !inserted)
                {
                    if (it->Hash.compare(student.Hash) == -1)
                    {
                        results.insert(it, student);
                        inserted = true;
                    }
                    it++;
                }

                if (!inserted)
                {
                    results.push_back(student);
                }
            }
        }
        WriteData("./results.txt", results);

    }
    else if (rank <= workerProcesses) // worker processes
    {
        MPI_Status s;
        int c;
        int dataSize;
        MPI_Probe(0, 0, MPI_COMM_WORLD, &s);
        MPI_Get_count(&s, MPI_INT, &c);
        MPI_Recv(&dataSize, c, MPI_INT, 0, 0, MPI_COMM_WORLD, &s);

        int a = dataSize / workerProcesses;
        int willReceive = dataSize - workerProcesses * a >= rank ? a + 1 : a;
        char buf[100] = "";
        MPI_Status status;
        int count;
        for (int j = 0; j < willReceive; j++)
        {
            char dummy[2] = { 'h', 'i' };
            MPI_Send(dummy, 2, MPI_CHAR, workerProcesses + 1, tagForWorkersForData, MPI_COMM_WORLD);

            MPI_Probe(workerProcesses + 1, tagForWorkersForData, MPI_COMM_WORLD, &status);
            MPI_Get_count(&status, MPI_CHAR, &count);
            MPI_Recv(buf, count, MPI_CHAR, workerProcesses + 1, tagForWorkersForData, MPI_COMM_WORLD, &status);
            string str(buf);
            Student student(str);

            hash<string> h;
            string hash = to_string(h(student.Name));

            student.Hash = hash;
            string studentWithHash = student.Serialize();
            int firstDigit = stoi(hash.substr(0, 1));
            if (firstDigit > 5)
            {
                const char* buffer = studentWithHash.c_str();
                MPI_Send(buffer, static_cast<int>(studentWithHash.size()), MPI_CHAR, workerProcesses + 2, tagForWorkersForResults, MPI_COMM_WORLD);
            }
        }
        char dummy[3] = { 'b', 'y', 'e' };
        MPI_Send(dummy, 3, MPI_CHAR, workerProcesses + 2, tagForWorkersForResults, MPI_COMM_WORLD);
    }

    else if (rank == workerProcesses + 1) // data process
    {
    MPI_Status s;
    int c;
    int dataSize;
    MPI_Probe(0, 0, MPI_COMM_WORLD, &s);
    MPI_Get_count(&s, MPI_INT, &c);
    MPI_Recv(&dataSize, c, MPI_INT, 0, 0, MPI_COMM_WORLD, &s);

        int index = 0;
        int arrayFill = -1;
        int studentsSent = 0;
        int studentsAdded = 0;
        Student* data = new Student[dataSize / 2];
        bool finished = false;

        int count; MPI_Status status;
        while (!finished) {
            char buf[100] = "";
            if (arrayFill < dataSize / 2 - 2 && studentsAdded < dataSize)
            {
                studentsAdded++;

                MPI_Probe(0, 0, MPI_COMM_WORLD, &status);
                MPI_Get_count(&status, MPI_CHAR, &count);
                MPI_Recv(buf, count, MPI_CHAR, 0, 0, MPI_COMM_WORLD, &status);
                string str(buf);
                Student student(str);
                arrayFill++;
                data[arrayFill] = student;

            }
            else
            {
                MPI_Probe(MPI_ANY_SOURCE, tagForWorkersForData, MPI_COMM_WORLD, &status);
                MPI_Get_count(&status, MPI_CHAR, &count);
                MPI_Recv(buf, count, MPI_CHAR, status.MPI_SOURCE, MPI_ANY_TAG, MPI_COMM_WORLD, &status);
                string student = data[arrayFill].Serialize();
                arrayFill--;
                const char* buffer = student.c_str();
                MPI_Send(buffer, static_cast<int>(student.size()), MPI_CHAR, status.MPI_SOURCE, tagForWorkersForData, MPI_COMM_WORLD);
                studentsSent++;
            }

            if (studentsSent == dataSize)
            {
                finished = true;
            }

        }
        delete[]data;

    }
    else if (rank == workerProcesses + 2) // results process
    {
        list<Student> results;
        int finishedWorkers = 0;
        char buf[100] = "";
        MPI_Status status;
        int count;
        while (finishedWorkers < workerProcesses)
        {
            MPI_Probe(MPI_ANY_SOURCE, tagForWorkersForResults, MPI_COMM_WORLD, &status);
            MPI_Get_count(&status, MPI_CHAR, &count);
            MPI_Recv(buf, count, MPI_CHAR, status.MPI_SOURCE, tagForWorkersForResults, MPI_COMM_WORLD, &status);
            string str(buf);
            if (str.substr(0, 3) == "bye") {
                finishedWorkers++;
            }
            else
            {
                results.push_back(Student(str));
            }
        }

        list<Student> ::iterator it = results.begin();
        while (it != results.end())
        {
            string student = it->Serialize();
            const char* buffer = student.c_str();
            MPI_Send(buffer, static_cast<int>(student.size()), MPI_CHAR, 0, 0, MPI_COMM_WORLD);
            it++;
        }
        char dummy[3] = { 'b', 'y', 'e' };
        MPI_Send(dummy, 3, MPI_CHAR, 0, 0, MPI_COMM_WORLD);
    }

    
    MPI_Finalize();
    return 0;
}

