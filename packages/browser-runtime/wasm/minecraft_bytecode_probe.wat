;; A tiny interpreter for original JVM Code bytes. It accepts only nop (0x00)
;; and return (0xb1); every other bytecode is rejected by returning zero.
(module
  (memory (export "memory") 1)
  (global $executed (mut i32) (i32.const 0))
  (func (export "execute_jvm_code") (param $ptr i32) (param $length i32) (result i32)
    (local $pc i32) (local $op i32)
    (global.set $executed (i32.const 0))
    (block $finished
      (loop $next
        (br_if $finished (i32.ge_u (local.get $pc) (local.get $length)))
        (local.set $op (i32.load8_u (i32.add (local.get $ptr) (local.get $pc))))
        (local.set $pc (i32.add (local.get $pc) (i32.const 1)))
        (global.set $executed (i32.add (global.get $executed) (i32.const 1)))
        (if (i32.eq (local.get $op) (i32.const 177)) (then (return (i32.const 1))))
        (if (i32.eq (local.get $op) (i32.const 0)) (then (br $next)))
        (return (i32.const 0))
      )
    )
    (i32.const 0)
  )
  (func (export "executed_opcode_count") (result i32) (global.get $executed))
)
