using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace ConsoleApp2
{
    class DataMonitor
    {
        private string Zodis = "*";
        private int PridetaA = 0;
        private int PridetaB = 0;
        private int PridetaC = 0;
        private int MinBalsiu = 3;

        private int MinAdded = 15;
        private bool Finished = false;


        public DataMonitor() { }

        public override string ToString()
        {
            lock (this)
            {
                return Zodis;
            }

        }

        public bool AddLetter(char letter)
        {
            lock (this)
            {
                if (letter != 'A')
                {
                    while (PridetaA < MinBalsiu && !Finished)
                    {
                        Monitor.Wait(this);
                    }

                    if (!Finished)
                    {
                        Zodis += letter;
                    }

                }
                else
                {
                    if (!Finished)
                    {
                        Zodis += letter;
                    }
                }

                switch (letter)
                {
                    case 'A':
                        PridetaA++;
                        break;
                    case 'B':
                        PridetaB++;
                        break;
                    case 'C':
                        PridetaC++;
                        break;
                    default:
                        break;
                }

                if (PridetaA == MinAdded || PridetaB == MinAdded || PridetaC == MinAdded)
                {
                    Finished = true;
                }

                Monitor.PulseAll(this);
                return !Finished;

            }
        }

    }
}
