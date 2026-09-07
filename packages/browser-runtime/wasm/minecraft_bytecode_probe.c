// Executes a deliberately small, safe subset of original JVM Code bytes in WebAssembly.
// It is not Minecraft logic and never reports success for unsupported bytecode.
typedef unsigned char u8;
typedef unsigned int u32;
static u32 executed;
__attribute__((export_name("execute_jvm_code"))) u32 execute_jvm_code(const u8 *code, u32 length) {
  u32 pc = 0; executed = 0;
  while (pc < length) { u8 op = code[pc++]; executed++;
    switch (op) {
      case 0x00: /* nop */ case 0x01: /* aconst_null */ case 0x02: case 0x03: case 0x04: case 0x05: case 0x06: case 0x07: case 0x08: /* iconst */ case 0x57: /* pop */ case 0x59: /* dup */ break;
      case 0x10: if (pc + 1 > length) return 0; pc += 1; break; /* bipush */
      case 0x11: if (pc + 2 > length) return 0; pc += 2; break; /* sipush */
      case 0xac: case 0xb0: case 0xb1: return 1; /* ireturn, areturn, return */
      default: return 0;
    }
  } return 0;
}
__attribute__((export_name("executed_opcode_count"))) u32 executed_opcode_count(void) { return executed; }
