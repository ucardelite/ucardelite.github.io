using System;
using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConsoleApp2
{
    class Program
    {
        static public bool threadsJoined = false;
        static void Main(string[] args)
        {
            DataMonitor zodis = new DataMonitor();
            List<Thread> threads = new List<Thread>();
            char[] raides = new char[] { 'A', 'B', 'C' };


            for (int i = 0; i < 3; i++)
            {
                int index = i;
                threads.Add(new Thread(() => ThreadWorker(ref zodis, raides[index])));
            }


            Task.Run(() =>
            {
                while (!threadsJoined)
                {
                    Console.WriteLine(zodis);
                }
            });

            threads.ForEach(thread =>
            {
                thread.Start();
            });

            threads.ForEach(thread =>
            {
                thread.Join();
            });

            threadsJoined = true;

            Console.WriteLine("Galutinis zodis: " + zodis);
        }

        static void PrintValue(DataMonitor zodis)
        {
            if (!threadsJoined)
            {
                Console.WriteLine(zodis.ToString());
                Task.Delay(0).ContinueWith((task) =>
                {
                    PrintValue(zodis);
                });
            }

        }

        static void ThreadWorker(ref DataMonitor dataMonitor, char letter = 'A')
        {
            bool response;
            while ((response = dataMonitor.AddLetter(letter)))
            {
            }
        }
    }
}
