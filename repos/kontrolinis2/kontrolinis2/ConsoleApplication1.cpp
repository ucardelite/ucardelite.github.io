
#include <iostream>
#include <mpi.h>
#include <string>
using namespace std;


int main(int args, char ** argvs)
{
		int rank = 0, numOfProcess = 0;
		int tagForWorkers = 1;
		int tagForPrinter = 2;

		MPI_Init(&args, &argvs);
		MPI_Comm_rank(MPI_COMM_WORLD, &rank);
		MPI_Comm_size(MPI_COMM_WORLD, &numOfProcess);


		if (rank == 0) // valdantysis procesas
		{
			int numbers[100] = {};
			int indexFromStart = 0;
			int indexFromEnd = 99;
			int addedNumbers = 0;
			int finishedProcesses = 0;
			while (finishedProcesses < 4)
			{
				MPI_Status status;
				int count;
				MPI_Probe(MPI_ANY_SOURCE, tagForWorkers, MPI_COMM_WORLD, &status);
				MPI_Get_count(&status, MPI_INT, &count);
				int number;

				MPI_Recv(&number, count, MPI_INT, MPI_ANY_SOURCE, tagForWorkers, MPI_COMM_WORLD, &status);

				if (addedNumbers >= 100)
				{
					finishedProcesses++;
					int response = 0;
					MPI_Send(&response, 1, MPI_INT, status.MPI_SOURCE, tagForWorkers, MPI_COMM_WORLD); // daugiau nebesiusti
				}
				else
				{
					if (number == 1 || number == 2) {
						
							numbers[indexFromStart] = number;
							indexFromStart++;
					}
					else if (number == 3 || number == 4)
					{
						
							numbers[indexFromEnd] = number;
							indexFromEnd--;
				
						
					}
					int response = 1;
					MPI_Send(&response, 1, MPI_INT, status.MPI_SOURCE, tagForWorkers, MPI_COMM_WORLD); // dar gali siusti
				}

				addedNumbers++;
				if (addedNumbers % 10 == 0)
				{
					string arr = "";
					for (int i = 0; i < 100; i++)
					{
						arr += "[" + to_string(i) + "]=" + to_string(numbers[i]) + ", ";
					}

					const char* buffer = arr.c_str();
					MPI_Send(buffer, static_cast<int>(arr.size()), MPI_CHAR, 5, tagForPrinter, MPI_COMM_WORLD);


				}
		}

		}

		else if (rank >= 1 && rank <= 4) // siuntejai procesai
		{
			bool finished = false;
			while (!finished)
			{
				MPI_Send(&rank, 1, MPI_INT, 0, tagForWorkers, MPI_COMM_WORLD);
				MPI_Status status;
				int count;
				MPI_Probe(0, tagForWorkers, MPI_COMM_WORLD, &status);
				int response;
				MPI_Get_count(&status, MPI_INT, &count);
				MPI_Recv(&response, count, MPI_INT, 0, tagForWorkers, MPI_COMM_WORLD, &status);
				if (response == 0)
				{
					finished = true;
				}

			}
		}

		else if (rank == 5) // spausdintojo procesas
		{
			int index = 0;
			while (index < 10)
			{

				index++;
				char buf[800] = "";
				MPI_Status status;
				int count;
				MPI_Probe(0, tagForPrinter, MPI_COMM_WORLD, &status);
				MPI_Get_count(&status, MPI_CHAR, &count);
				MPI_Recv(buf, count,  MPI_CHAR, 0, tagForPrinter, MPI_COMM_WORLD, &status);
				string str(buf);
				cout << "Tarpiniai rezultatai: " << str << "\n\n\n";
			}
		}

		MPI_Finalize();
	}


    
    

