using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public int Id { get; set; }
        [Required]
        public int CPF { get; set; }
        [Required]
        public string NOME { get; set; }
    }
}