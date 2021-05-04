using Microsoft.VisualBasic.CompilerServices;
using System;
using System.Collections.Generic;
using System.Threading;

namespace pavyzdine_uzduotis_lygiagretaus_kontro
{
    class Program
    {
        static void Main(string[] args)
        {
            DataMonitor zodis = new DataMonitor();
            List<Thread> threads = new List<Thread>();
            char[] raides = new char[] { 'A', 'B', 'C' };
            bool threadsJoined = false;


            for(int i = 1; i <= 3; i++)
            {
                threads.Add(new Thread(() => ThreadWorker(ref zodis, raides[i])));
            }

            while(!threadsJoined)
            {
                Console.WriteLine(zodis.ToString());
            }

            threads.ForEach(thread =>
            {
                thread.Start();
            });

            threads.ForEach(thread =>
            {
                thread.Join();
            });

            threadsJoined = true;


        }

        static void ThreadWorker(ref DataMonitor dataMonitor, char letter)
        {
            bool response;
            while((response = dataMonitor.AddLetter(letter)))
            {
            }
        }
    }
}
