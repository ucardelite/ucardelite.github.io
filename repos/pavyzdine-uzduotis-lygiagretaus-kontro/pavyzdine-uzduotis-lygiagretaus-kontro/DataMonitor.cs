using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;

namespace pavyzdine_uzduotis_lygiagretaus_kontro
{
    class DataMonitor
    {
        private string Zodis = "*";
        private int PridetaA = 0;
        private int PridetaB = 0;
        private int PridetaC = 0;
        private int MinBalsiu = 3;
        private bool Finished = false;
 

        public DataMonitor() { }

        public override string ToString()
        {
            return Zodis;
        }

        public bool AddLetter(char letter)
        {
            lock (this)
            {
                if(letter != 'A')
                {
                    while (PridetaA < MinBalsiu && !Finished)
                    {
                        Monitor.Wait(this);
                    }

                    if(!Finished)
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

                if(PridetaA == 15 || PridetaB == 15 || PridetaC == 15)
                {
                    Finished = true;
                }

                Monitor.PulseAll(this);
                return !Finished;
                
            }
        }

    }
}
